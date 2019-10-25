export class Order {

    constructor(public name: string, public phoneNumber: string, public gender: string, 
        public dob: number, public orderDate: number, public orderType: string, public units: number,
        public label: number) {
    }
}