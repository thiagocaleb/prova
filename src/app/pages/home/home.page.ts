import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private products = new Array<Product>();
  private productsSubscription: Subscription;
  private loading: any;
  

  constructor(
    private productsService: ProductService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
    ) {
    this.productsSubscription = this.productsService.getProducts().subscribe(data => {
      this.products = data; 
    });
   }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.productsService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Error while saving');
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Please, wait...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
