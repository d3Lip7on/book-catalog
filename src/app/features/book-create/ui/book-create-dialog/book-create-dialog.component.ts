import { EDialogCloseStatus } from '@/shared';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ECreateBookFormAction } from '../../model/types';
import { BookCreateFormComponent } from '../book-create-form/book-create-form.component';

@Component({
  selector: 'app-book-create-dialog',
  imports: [BookCreateFormComponent],
  templateUrl: './book-create-dialog.component.html',
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
