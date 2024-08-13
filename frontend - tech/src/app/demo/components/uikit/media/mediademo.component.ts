import { Component, OnInit } from '@angular/core';
import { TechService } from 'src/app/demo/service/techniciens.service';
import { PhotoService } from 'src/app/demo/service/photo.service';
import { Technicien } from 'src/app/demo/api/technicien';

@Component({
    templateUrl: './mediademo.component.html'
})
export class MediaDemoComponent implements OnInit {

    products!: Technicien[];

    images!: any[];

    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(private techService: TechService, private photoService: PhotoService) { }

    ngOnInit() {
        this.techService.getProductsSmall().then(products => {
            this.products = products;
        });

        this.photoService.getImages().then(images => {
            this.images = images;
        });
    }

}
