namespace BookQuoteManager.Api.Features.Books;

public sealed record BookResponse(
    int Id,
    string Title,
    string Author,
    DateOnly PublishedDate);
