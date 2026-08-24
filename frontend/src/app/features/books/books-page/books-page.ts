import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { BookResponse } from '../book-response';
import { BooksApi } from '../books-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type BooksViewState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'success';
      readonly books: readonly BookResponse[];
    }
  | {
      readonly status: 'error';
      readonly message: string;
    };

@Component({
  selector: 'app-books-page',
  imports: [],
  templateUrl: './books-page.html',
  styleUrl: './books-page.css',
})
export class BooksPage implements OnInit {
  private readonly booksApi = inject(BooksApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly state = signal<BooksViewState>({
    status: 'loading',
  });

  ngOnInit(): void {
    this.booksApi
      .getBooks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (books) => {
          this.state.set({
            status: 'success',
            books,
          });
        },
        error: () => {
          this.state.set({
            status: 'error',
            message: 'Unable to load books. Please try again later.',
          });
        },
      });
  }
}
