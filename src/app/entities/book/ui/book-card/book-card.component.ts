import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IBook } from '../../model/book.interface';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-card',
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './book-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCardComponent {
  book = input<IBook | null>();
}
