import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, QRCodeModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  cards: any[] = [];
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.loadData();
  }


  private loadData(): void {
    this.http.get('https://raw.githubusercontent.com/stonehappi/mock-data/master/fe/sca.json')
      .subscribe({
        next: (data: any) => {
          this.cards = data;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
  }
  downloadPDF(): void {
    var elements = document.getElementsByClassName('card-front') as any as HTMLElement[];
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
    html2canvas(element!).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${name}.png`;
      link.click();
      element.classList.add('shadow-lg');
    });
  }

}
