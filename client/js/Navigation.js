const SearchInput = document.querySelector('.h-nav-search-inp');
const SearchCancel = document.querySelector('.h-nav-search-cancel');

SearchInput.addEventListener('input', (e) => {
    e.preventDefault();

    if (SearchInput.value) {
        SearchCancel.classList.remove('hidden');
    } else {
        SearchCancel.classList.add('hidden');
    }
});

SearchCancel.addEventListener('click', (e) => {
    e.preventDefault();
    SearchInput.value = "";
    SearchCancel.classList.add('hidden');
});