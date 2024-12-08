# Rezz

This is a reservations app built with NestJS in a microservices architecture. It allows users to authenticate, create a reservation, pay for it via Stripe, and receive a notification email via Gmail after booking.

## Architecture

The microservices communicate via TCP and are Dockerized. They are hosted in a Kubernetes cluster via Amazon Web Services's Elastic Kubernetes Service, Elastic Container Registry, EC2, and Cloud Pipeline for CI/CD. There is a load balancer that helps direct HTTP requests.

![\[./app-architecture.png\]](app-architecture.png)
