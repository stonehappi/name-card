import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {QRCodeModule} from 'angularx-qrcode';
import {HttpClient} from '@angular/common/http';
import {NgOptimizedImage} from "@angular/common";
import * as htmlToImage from 'html-to-image';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QRCodeModule, NgOptimizedImage],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  cards: any[] = [];
  card: any[] = [];
  id: string | undefined;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'];
      if (this.id !== id) {
        this.id = id;
      }
    });
    this.loadData();
  }


  private loadData(): void {
    if (this.cards.length > 0) {
      if (this.id) {
        this.card = this.cards.filter(card => card.code == this.id);
      } else {
        this.card = this.cards;
      }
      return;
    }
    this.http.get('https://raw.githubusercontent.com/stonehappi/mock-data/master/fe/sca.json')
      .subscribe({
        next: (data: any) => {
          this.cards = data;
          if (this.id) {
            this.card = this.cards.filter(card => card.code == this.id);
          } else {
            this.card = this.cards;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }

  downloadPDF(): void {
    let elements = document.getElementsByClassName('card-front') as any as HTMLElement[];
    for (const ele of elements) {
      this.saveImage(ele, 'card-front');
    }
    elements = document.getElementsByClassName('card-back') as any as HTMLElement[];
    for (const ele of elements) {
      this.saveImage(ele, 'card-back');
    }
  }

  private saveImage(element: HTMLElement, name: string): void {
    if (!element) return;
    element.classList.remove('shadow-lg');
    htmlToImage.toPng(element)
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${name}.png`;
        link.click();
        element.classList.add('shadow-lg');
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

}
