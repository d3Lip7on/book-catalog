import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../../../entities/book/api/book.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICreateBook } from '../../../../entities/book/model/create-book.interface';
import { ECreateBookFormAction } from '../../model/types';

@Component({
  selector: 'app-book-create-form',
  providers: [provideNativeDateAdapter()],
  imports: [
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './book-create-form.component.html',
  styleUrl: './book-create-form.component.scss',
})
export class BookCreateFormComponent {
  imagePreview = signal<string | null>(null);
  action = output<ECreateBookFormAction>();

  #fb = inject(FormBuilder);
  #bookService = inject(BookService);
  #destroyRef = inject(DestroyRef);

  isFileLoading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  bookForm = this.#fb.group({
    title: this.#fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    author: this.#fb.control<string>('', { nonNullable: true, validators: [Validators.required] }),
    publishedDate: this.#fb.control<Date | null>(null, { validators: [Validators.required] }),
    description: this.#fb.control<string>('', { nonNullable: true }),
    image: this.#fb.control<string | null>(null),
  });

  onFileSelected(event: Event) {
    this.isFileLoading.set(true);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        this.imagePreview.set(result);
        this.bookForm.patchValue({ image: result });
        this.isFileLoading.set(false);
      };
      reader.readAsDataURL(file);
    }
  }

  onCancelButtonClick() {
    this.action.emit(ECreateBookFormAction.Cancel);
  }

  onCreateButtonClick() {
    if (this.bookForm.valid) {
      const createBookData: ICreateBook = this.#mapFormToCreateBookData();
      this.#createBook(createBookData);
    } else {
      this.bookForm.markAllAsTouched();
    }
  }

  #mapFormToCreateBookData(): ICreateBook {
    return {
      title: this.bookForm.controls.title.value,
      author: this.bookForm.controls.author.value,
      publishedDate: this.bookForm.controls.publishedDate.value,
      description: this.bookForm.controls.description.value,
      image: this.bookForm.controls.image.value,
    };
  }

  #createBook(createBookData: ICreateBook) {
    this.isSubmitting.set(true);
    this.#bookService
      .createBook(createBookData)
      .pipe(
        tap(() => this.action.emit(ECreateBookFormAction.Submit)),
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }
}
