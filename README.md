# Rezz

This is a reservations app built with NestJS in a microservices architecture. It allows users to authenticate, create a reservation, pay for it via Stripe, and receive a notification email after booking.

## Architecture

The microservices communicate via TCP and are dockerized. They are hosted in Google Cloud via a Kubernetes cluster. There is a load balancer that helps direct requests.

![\[./app-architecture.png\]](app-architecture.png)
