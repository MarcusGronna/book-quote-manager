using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;

namespace BookQuoteManager.Api.Tests.Features.Books;

public sealed class BooksEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public BooksEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetBooks_ReturnsOkWithJsonContent()
    {
        using HttpClient client = _factory.CreateClient(
            new WebApplicationFactoryClientOptions
            {
                BaseAddress = new Uri("https://localhost")
            });

        HttpResponseMessage response = await client.GetAsync("/api/books");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(
            "application/json",
            response.Content.Headers.ContentType?.MediaType);
    }
}
