import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '../../../libs/common/src/dto/create-charge.dto';
@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-11-20.acacia',
    },
  );

  constructor(private readonly configService: ConfigService) {}

  // Use the Payment Intents API from Stripe to create a charge on the user's card
  async createCharge({ amount }: CreateChargeDto) {
    // We hardcode to a test card 'pm_card_visa' using their provided tokens: https://docs.stripe.com/testing?testing-method=tokens#cards
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      payment_method_types: ['card'],
      amount: amount * 100, // Amount param is in dollars, convert to cents
      currency: 'usd',
      confirm: true,
    });
    return paymentIntent;
  }
}
