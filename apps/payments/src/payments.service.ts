import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  // Register the Stripe API object
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-11-20.acacia',
    },
  );

  // Use the Payment Intents API from Stripe to create a charge on the user's card
  // After transacting a charge of any type, send a notification email to the user who is being billed.
  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      // We hardcode to a test card 'pm_card_visa' using their provided tokens: https://docs.stripe.com/testing?testing-method=tokens#cards
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      amount: amount * 100, // Amount param is in dollars, convert to cents
      currency: 'usd',
      confirm: true,
    });

    // Send a message to the notification microservice
    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of $${amount} has completed successfully.`,
    });

    return paymentIntent;
  }
}
