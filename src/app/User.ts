export class User {
  user_id!: string;
  first_name!: string;
  last_name!: string;

  constructor(user_id?: string, first_name?: string, last_name?: any) {
    if (user_id) {
      this.user_id = user_id;
    }
    if (first_name) {
      this.first_name = first_name;
    }
    if (last_name) {
      this.last_name = last_name;
    }
  }

  getName(): string {
    return this.first_name + " " + this.last_name;
  }
}
