import { trigger, state, style, animate, transition } from '@angular/animations';

export const slideUpDownAnimation = trigger('slideUpDown', [
    state('void', style({ transform: 'translateY(100%)', opacity: 0 })),
    state('*', style({ transform: 'translateY(0)', opacity: 1 })),
    transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
    ]),
    transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
    ]),
]);