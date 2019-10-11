export class Order {

    constructor(public name: string, public phoneNumber: string, public gender: string, 
        public dob: Date, public orderDate: Date, public orderType: string, public units: number,
        public label: number) {
    }
}