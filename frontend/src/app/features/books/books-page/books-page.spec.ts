import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksPage } from './books-page';
import { BooksApi } from '../books-api';
import { of } from 'rxjs';

describe('BooksPage', () => {
  let component: BooksPage;
  let fixture: ComponentFixture<BooksPage>;
  let booksApi: jasmine.SpyObj<BooksApi>;

  beforeEach(async () => {
    booksApi = jasmine.createSpyObj<BooksApi>('BooksApi', ['getBooks']);
    booksApi.getBooks.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [BooksPage],
      providers: [{ provide: BooksApi, useValue: booksApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request books when initialized', () => {
    expect(booksApi.getBooks).toHaveBeenCalledOnceWith();
  });
});
