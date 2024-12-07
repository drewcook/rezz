# Development steps

FROM node:alpine as development

WORKDIR /usr/src/app

# Copy over app files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/reservations apps/reservations
COPY libs libs

# Install dependencies & build app
RUN npm install -g pnpm
RUN pnpm install
RUN cd apps/reservations && pnpm install
RUN pnpm build reservations

# Production steps

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/reservations/main"]