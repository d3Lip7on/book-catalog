import { Component, inject } from '@angular/core';
import { BookCreateFormComponent } from '../book-create-form/book-create-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { EDialogCloseStatus } from '../../../../shared/lib/dialog/dialog.types';
import { ECreateBookFormAction } from '../../model/types';

@Component({
  selector: 'app-book-create-dialog',
  imports: [BookCreateFormComponent],
  templateUrl: './book-create-dialog.component.html',
  styleUrl: './book-create-dialog.component.scss',
})
export class BookCreateDialogComponent {
  #dialogRef = inject(MatDialogRef<BookCreateDialogComponent>);

  onFormAction(event: ECreateBookFormAction) {
    switch (event) {
      case ECreateBookFormAction.Submit:
        this.#dialogRef.close(EDialogCloseStatus.Success);
        break;
      case ECreateBookFormAction.Cancel:
        this.#dialogRef.close(EDialogCloseStatus.Cancel);
        break;
      case ECreateBookFormAction.Error:
        this.#dialogRef.close(EDialogCloseStatus.Error);
        break;
      default:
        this.#dialogRef.close(EDialogCloseStatus.Cancel);
    }
  }
}
