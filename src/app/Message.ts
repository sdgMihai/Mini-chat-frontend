export class Message {
  sender_name!: string;
  data!: string;
  sent_at!: any;

  constructor(sender_name?: string, data?: string, sent_at?: any) {
    if (sender_name) {
      this.sender_name = sender_name;
    }
    if (data) {
      this.data = data;
      console.log(this.data);
    }
    if (sent_at) {
      this.sent_at = sent_at;
      console.log(this.sent_at);
    }
  }
}
