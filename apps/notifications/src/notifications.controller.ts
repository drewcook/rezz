import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Receive an event from another service and simply send out a notification email without replying back to the service.
  // This reduces overhead from a full request/response cycle.
  @EventPattern('notify_email')
  @UsePipes(new ValidationPipe()) // Apply nested validation
  async notifyEmail(@Payload() data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data);
  }
}
