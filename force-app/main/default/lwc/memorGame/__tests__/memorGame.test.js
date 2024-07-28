import { createElement } from 'lwc';
import MemorGame from 'c/memorGame';
import { loadStyle } from 'lightning/platformResourceLoader';
import fontawesome from '@salesforce/resourceUrl/fontawesome';

describe('c-memor-game', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-memor-game', { is: MemorGame });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // Remove any remaining DOM elements after each test
        document.body.innerHTML = '';
    });

    it('should have initial state', () => {
        expect(element.isLibLoaded).toBe(false);
        expect(element.totalTime).toBe('00:00');
        expect(element.showCongratulations).toBe(false);
        expect(element.moves).toBe(0);
        expect(element.opencards).toHaveLength(0);
        expect(element.matchedCard).toHaveLength(0);
        expect(element.cards).toHaveLength(16);
    });

    it('should handle displaycard method correctly', () => {
        const card = { type: 'diamond', classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        element.opencards = [];
        element.displaycard({ target: card });
        expect(element.opencards).toHaveLength(1);
        expect(card.classList.add).toHaveBeenCalledWith('open', 'show', 'disabled');
    });

    it('should call matched method when two cards match', () => {
        const card1 = { type: 'diamond', classList: { add: jest.fn(), remove: jest.fn() } };
        const card2 = { type: 'diamond', classList: { add: jest.fn(), remove: jest.fn() } };
        element.opencards = [card1, card2];
        element.matched();
        expect(card1.classList.add).toHaveBeenCalledWith('match', 'disabled');
        expect(card2.classList.add).toHaveBeenCalledWith('match', 'disabled');
        expect(element.opencards).toHaveLength(0);
        expect(element.matchedCard).toHaveLength(2);
        expect(element.showCongratulations).toBe(true);
    });

    it('should call unmatched method when two cards do not match', () => {
        const card1 = { type: 'diamond', classList: { add: jest.fn(), remove: jest.fn() } };
        const card2 = { type: 'bomb', classList: { add: jest.fn(), remove: jest.fn() } };
        element.opencards = [card1, card2];
        element.unmatched();
        expect(card1.classList.add).toHaveBeenCalledWith('unmatched');
        expect(card2.classList.add).toHaveBeenCalledWith('unmatched');
        setTimeout(() => {
            expect(card1.classList.remove).toHaveBeenCalledWith('show', 'open', 'unmatched');
            expect(card2.classList.remove).toHaveBeenCalledWith('show', 'open', 'unmatched');
        }, 1000);
        expect(element.opencards).toHaveLength(0);
    });

    it('should shuffle cards and reset the game', () => {
        element.shuffle();
        expect(element.showCongratulations).toBe(false);
        expect(element.opencards).toHaveLength(0);
        expect(element.matchedCard).toHaveLength(0);
        expect(element.totalTime).toBe('00:00');
        expect(element.moves).toBe(0);
        expect(element.cards).toHaveLength(16);
    });

    it('should handle the renderedCallback and load Font Awesome', () => {
        loadStyle.mockResolvedValue();
        element.renderedCallback();
        expect(loadStyle).toHaveBeenCalledWith(element, `${fontawesome}/fontawesome/css/font-awesome.min.css`);
        return loadStyle.mock.results[0].value;
    });

    it('should correctly start the timer and update totalTime', () => {
        jest.useFakeTimers();
        element.startTimer();
        jest.advanceTimersByTime(1000);
        expect(element.totalTime).toBe('1 second, ');
        jest.advanceTimersByTime(60000);
        expect(element.totalTime).toBe('1 minute, 1 second, ');
    });

    it('should handle action method to enable and disable cards', () => {
        const card1 = { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        const card2 = { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } };
        element.template = {
            querySelectorAll: jest.fn(() => [card1, card2])
        };
        element.action('DISABLE');
        expect(card1.classList.add).toHaveBeenCalledWith('disabled');
        expect(card2.classList.add).toHaveBeenCalledWith('disabled');
        element.action('ENABLE');
        expect(card1.classList.remove).toHaveBeenCalledWith('disabled');
        expect(card2.classList.remove).toHaveBeenCalledWith('disabled');
    });
});
