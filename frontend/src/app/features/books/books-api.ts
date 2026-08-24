import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BookResponse } from './book-response';

@Injectable({
  providedIn: 'root',
})
export class BooksApi {
  private readonly http = inject(HttpClient);
  private readonly booksUrl = 'https://localhost:7175/api/books';

  getBooks(): Observable<readonly BookResponse[]> {
    return this.http.get<readonly BookResponse[]>(this.booksUrl);
  }
}
