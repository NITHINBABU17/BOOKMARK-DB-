document.addEventListener('DOMContentLoaded', () => {
    getProductList();
    const searchInput = document.getElementById('testSearchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value;
        if (query) {
            searchProductList(query);
        } else {
            getProductList();
        }
    });
});

// Function to get the product list
const getProductList = () => {
    axios.get('/productAjax/retrieve_products')
        .then(response => {
            renderProductList(response.data);
        })
        .catch(error => {
            console.error('Error getting product list:', error);
        });
};

// Function to search the product list
const searchProductList = (query) => {
    axios.get('/productAjax/search_products', { params: { q: query } })
        .then(response => {
            renderProductList(response.data);
        })
        .catch(error => {
            console.error('Error searching product list:', error);
        });
};

// Function to render the product list
const renderProductList = (products) => {
    const productList = document.querySelector('#product-table tbody');
    productList.innerHTML = '';
    products.forEach(bookmark => {
        const row = `<tr>
                        <td>${bookmark.title}</td>
                        <td>${bookmark.url}</td>
                    </tr>`;
        productList.innerHTML += row;
    });
};
