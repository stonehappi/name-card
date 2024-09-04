import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QRCodeModule } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { HttpClient } from '@angular/common/http';

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
    this.saveImage('card-front');
    this.saveImage('card-back');
  }

  private saveImage(id: string): void {
    const element = document.getElementById(id) as HTMLElement;
    if (!element) return;
    element.classList.remove('shadow-lg');
    html2canvas(element!).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${id}.png`;
      link.click();
      element.classList.add('shadow-lg');
    });
  }
}
