using Microsoft.AspNetCore.Mvc;

namespace BookQuoteManager.Api.Features.Books;

[ApiController]
[Route("api/books")]
public sealed class BooksController : ControllerBase
{
    private static readonly BookResponse[] Books =
    [
        new(
            1,
            "Clean Code",
            "Robert C. Martin",
            new DateOnly(2008, 8, 1)),
        new(
            2,
            "The Pragmatic Programmer",
            "David Thomas and Andrew Hunt",
            new DateOnly(1999, 10, 20)),
        new(
            3,
            "Refactoring",
            "Martin Fowler",
            new DateOnly(1999, 7, 8))
    ];

    [HttpGet]
    public ActionResult<IReadOnlyList<BookResponse>> GetBooks()
    {
        return Ok(Books);
    }
}
