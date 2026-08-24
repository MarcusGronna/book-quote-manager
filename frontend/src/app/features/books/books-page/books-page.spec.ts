import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';

import { BookResponse } from '../book-response';
import { BooksApi } from '../books-api';
import { BooksPage } from './books-page';

describe('BooksPage', () => {
  let booksApi: jasmine.SpyObj<BooksApi>;

  beforeEach(async () => {
    booksApi = jasmine.createSpyObj<BooksApi>('BooksApi', ['getBooks']);

    await TestBed.configureTestingModule({
      imports: [BooksPage],
      providers: [{ provide: BooksApi, useValue: booksApi }],
    }).compileComponents();
  });

  function createComponent(): ComponentFixture<BooksPage> {
    const fixture = TestBed.createComponent(BooksPage);
    fixture.detectChanges();
    return fixture;
  }

  it('should request books when initialized', () => {
    booksApi.getBooks.and.returnValue(of([]));

    createComponent();

    expect(booksApi.getBooks).toHaveBeenCalledOnceWith();
  });

  it('should display a loading state while waiting for books', () => {
    booksApi.getBooks.and.returnValue(NEVER);

    const fixture = createComponent();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="status"]')?.textContent).toContain('Loading books...');
  });

  it('should render books returned by the API', () => {
    const books: readonly BookResponse[] = [
      {
        id: 1,
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedDate: '2008-08-01',
      },
    ];
    booksApi.getBooks.and.returnValue(of(books));

    const fixture = createComponent();
    const element = fixture.nativeElement as HTMLElement;
    const cards = element.querySelectorAll('article');

    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Clean Code');
    expect(cards[0].textContent).toContain('Robert C. Martin');
    expect(cards[0].querySelector('time')?.getAttribute('datetime')).toBe('2008-08-01');
  });

  it('should display a user-facing message when the request fails', () => {
    booksApi.getBooks.and.returnValue(throwError(() => new Error('Internal network details')));

    const fixture = createComponent();
    const element = fixture.nativeElement as HTMLElement;
    const alert = element.querySelector('[role="alert"]');

    expect(alert?.textContent).toContain('Unable to load books. Please try again later.');
    expect(alert?.textContent).not.toContain('Internal network details');
  });
});
