class PageController {

    /**
     * Creates an Object instance with following params
     * @param {*} page 
     * @param {*} carousel 
     */
    constructor(page, ...carousel) {
        this.page = page;
        this.carouselCard = carousel || false;
        console.log(carousel);
    }
}

module.exports = PageController;