FROM node:16 AS deps

WORKDIR /app

RUN yarn global add pnpm

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .
RUN pnpm build

ENV NODE_ENV production
EXPOSE 3000
ENV PORT 3000
CMD ["pnpm", "start"]