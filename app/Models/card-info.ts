export class Card {
    //tal vez deva cambiar el $, creo que es lo que da problemas.
    Id?: number;
    name?: string;
    description?: string;
    cardListId?: number;
    parent?: string;
    isExpanded?: boolean;
    orders?: number;
    created_at?: string;
}
