import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  /**
   * Creates a new reservation for the authenticated user. Reaches out to the Payments microservice to charge the user's card via the Stripe API.
   * @param createReservationDto The DTO
   * @param userId The user ID from the JWT of the current authenticated user
   * @returns
   */
  async create(createReservationDto: CreateReservationDto, userId: string) {
    // Send a message to the Payments microservice to create a charge using the payload.
    // Create a reservation in response after the charge is successful.
    return this.paymentsService
      .send('create_charge', createReservationDto.charge)
      .pipe(
        map(async (paymentIntentResponse) => {
          return await this.reservationsRepository.create({
            ...createReservationDto,
            invoiceId: paymentIntentResponse.id,
            timestamp: new Date(),
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationsRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      {
        $set: updateReservationDto,
      },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
