FROM mhart/alpine-node:10 AS builder

WORKDIR /usr/src/app

COPY . .
RUN yarn install

FROM mhart/alpine-node:10

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ .
CMD ["yarn", "start"]
