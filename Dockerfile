FROM node:slim
WORKDIR /app
COPY . .
COPY .env .env
RUN npm install
ENV WS_IAM_KEY=AKIAQETYL3MGUYGHWQZY
ENV AWS_IAM_SECRET=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
ENV AWS_REGION=ap-southeast-2
ENV APP_LANGUAGE_CODE=en_US
ENV APP_BOT_ID=LUASMM7P1E
ENV APP_BOT_ALIAS=Z9D47G1J2K
EXPOSE 5500
CMD ["npm", "start"]
