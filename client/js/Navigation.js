const SearchInput = document.querySelector('.h-nav-search-inp');
const SearchCancel = document.querySelector('.h-nav-search-cancel');
const FilterBtn = document.querySelector('.h-nav-search-filter');
const FilterToast = document.getElementById('h-nav-filter-toast');
const InputCity = document.getElementById('city-filter');
const InputBedType = document.getElementById('bed-type-filter');
const InputBedSize = document.getElementById('bed-size-filter');
const InputFloor = document.getElementById('floor-filter');
const InputRating = document.getElementById('rating-filter');
const InputPrice = document.getElementById('price-filter');
const InputRatingValue = document.querySelector('.rating-value');

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

FilterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (FilterToast.classList.contains('show')) {
        FilterToast.classList.remove('show');
        FilterToast.classList.add('hide');
    }
    else {
        FilterToast.classList.remove('hide');
        FilterToast.classList.add('show');
    }
});

InputRating.addEventListener('input', (e) => {
    e.preventDefault();
    InputRatingValue.innerHTML = InputRating.value;
});

let filterOptions = {
    city: '',
    type: '',
    bedSize: '',
    floor: '',
    rating: '',
    price: ''
};

function SaveFilter() {
    const params = [InputCity.value, InputBedType.value, InputBedSize.value, InputFloor.value, InputRating.value, InputPrice.value];
    let i = 0;
    Object.keys(filterOptions).forEach(key => {
        filterOptions[key] = params[i];
        i++;
    });
    console.log(filterOptions);
}