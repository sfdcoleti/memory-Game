import { LightningElement } from 'lwc';
import { loadStyle } from 'lightning/platformResourceLoader';
import fontawesome from '@salesforce/resourceUrl/fontawesome';

export default class MemorGame extends LightningElement {
    // Boolean flag to track if the Font Awesome library is loaded
    isLibLoaded = false;
    timerRef;
    opencards = []; // Arrays to store open cards and matched cards
    matchedCard = []; // Arrays to store open cards and matched cards
    totalTime = "00:00"; // Initialize as a string
    showCongratulations = false; // Missing comma fixed
    
    moves = 0; // Counter for the number of moves

    // Array of card objects with their properties
    cards = [
        { id: 1, listclass: "card", type: "diamond", icon: "fa fa-diamond" },
        { id: 2, listclass: "card", type: "bomb", icon: "fa fa-bomb" },
        { id: 3, listclass: "card", type: "snowflake", icon: "fa fa-snowflake-o" },
        { id: 4, listclass: "card", type: "diamond", icon: "fa fa-diamond" },
        { id: 5, listclass: "card", type: "bug", icon: "fa fa-bug" },
        { id: 6, listclass: "card", type: "anchor", icon: "fa fa-anchor" },
        { id: 7, listclass: "card", type: "certificate", icon: "fa fa-certificate" },
        { id: 8, listclass: "card", type: "anchor", icon: "fa fa-anchor" },
        { id: 9, listclass: "card", type: "bolt", icon: "fa fa-bolt" },
        { id: 10, listclass: "card", type: "cube", icon: "fa fa-cube" },
        { id: 11, listclass: "card", type: "bug", icon: "fa fa-bug" },
        { id: 12, listclass: "card", type: "certificate", icon: "fa fa-certificate" },
        { id: 13, listclass: "card", type: "snowflake", icon: "fa fa-snowflake-o" },
        { id: 14, listclass: "card", type: "bomb", icon: "fa fa-bomb" },
        { id: 15, listclass: "card", type: "bolt", icon: "fa fa-bolt" },
        { id: 16, listclass: "card", type: "cube", icon: "fa fa-cube" }
    ];

    get gameRating() {
        let stars = this.moves < 12 ? [1, 2, 3] : this.moves >= 13 ? [1, 2] : [1];
        return this.matchedCard.length === 16 ? stars : [];
    }

    // Method to handle click event on cards
    displaycard(event) {
        // Get the current card element
        let currcard = event.target;
        // Add classes to show the card as open and disabled
        currcard.classList.add("open", "show", "disabled");
        // Add current card to the list of open cards
        this.opencards = this.opencards.concat(currcard);

        // Check if two cards are open
        const len = this.opencards.length;
        if (len === 2) {
            // Increment move counter
            this.moves++;
            if (this.moves === 1) {
                this.startTimer(); // Corrected method call
            }
            // Check if both open cards match
            if (this.opencards[0].type === this.opencards[1].type) {
                // Add matched cards to matchedCard array and call matched method
                this.matchedCard = this.matchedCard.concat(this.opencards[0], this.opencards[1]);
                this.matched();
            } else {
                // Call unmatched method if cards do not match
                this.unmatched();
            }
        }
    }

    // Method to handle matched cards
    matched() {
        // Add match class and disable open cards
        this.opencards[0].classList.add("match", "disabled");
        this.opencards[1].classList.add("match", "disabled");
        // Remove show and open classes from matched cards
        this.opencards[0].classList.remove("show", "open");
        this.opencards[1].classList.remove("show", "open");
        // Reset open cards array
        this.opencards = [];
        // Stop the timer if all cards are matched
        if (this.matchedCard.length === 16) {
            window.clearInterval(this.timerRef);
            this.showCongratulations = true
        }
    }

    // Method to handle unmatched cards
    unmatched() {
        // Add unmatched class to cards and disable actions
        this.opencards[0].classList.add("unmatched");
        this.opencards[1].classList.add("unmatched");
        this.action('DISABLE');
        // Reset unmatched cards after a delay
        setTimeout(() => {
            this.opencards[0].classList.remove("show", "open", "unmatched");
            this.opencards[1].classList.remove("show", "open", "unmatched");
            this.opencards = [];
            this.action('ENABLE');
        }, 1000);
    }

    // Method to enable or disable all cards
    action(action) {
        // Select all cards and perform action based on input
        let cards = this.template.querySelectorAll('.card');
        Array.from(cards).forEach(item => {
            if (action === 'ENABLE') {
                let isMatch = item.classList.contains('match');
                if (!isMatch) {
                    item.classList.remove("disabled");
                }
            }
            if (action === 'DISABLE') {
                item.classList.add("disabled");
            }
        });
    }

    // Method to start the timer
    startTimer() {
        let startTime = new Date();
        this.timerRef = setInterval(() => {
            let diff = new Date().getTime() - startTime.getTime();
            let d = Math.floor(diff / 1000);
            const m = Math.floor((d % 3600) / 60);
            const s = Math.floor(d % 60);
            const mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes, ") : "";
            const sDisplay = s > 0 ? s + (s === 1 ? " second " : " seconds, ") : "";
            this.totalTime = mDisplay + sDisplay;
        }, 1000);
    }

    shuffle() {
        this.showCongratulations = false;
        this.opencards = []; // Corrected from 'openedCards' to 'opencards'
        this.matchedCard = [];
        this.totalTime = '00:00';
        this.moves = 0;
        window.clearInterval(this.timerRef);
        let elem = this.template.querySelectorAll('.card');
        Array.from(elem).forEach(item => {
            item.classList.remove("show", "open", "match", "disabled");
        });
        /***shuffling and swapping logic */
        let array = [...this.cards];
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;

            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        this.cards = [...array];
    }

    // Lifecycle hook that runs after the component renders
    renderedCallback() {
        // Check if Font Awesome library is already loaded
        if (this.isLibLoaded) {
            return;
        } else {
            // Load Font Awesome styles if not already loaded
            console.log('FONT_AWESOME URL:', fontawesome);
            loadStyle(this, fontawesome + '/fontawesome/css/font-awesome.min.css')
                .then(() => {
                    console.log('Font Awesome loaded successfully');
                    this.isLibLoaded = true;
                })
                .catch(error => {
                    console.error('Error loading Font Awesome', error);
                });
        }
    }
}
