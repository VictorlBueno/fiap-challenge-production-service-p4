import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './infrastructure/modules/app.module';
import * as serverless from 'serverless-http';
import * as dotenv from 'dotenv';

dotenv.config();
let cachedServer: serverless.Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Fast Food Self-Service API')
        .setDescription('API for the fast food self-service ordering system')
        .setVersion('1.0')
        .addTag('orders')
        .addTag('products')
        .addTag('clients')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'],
            displayRequestDuration: true,
            docExpansion: 'list',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
            tryItOutEnabled: true,
        },
        customSiteTitle: 'Fast Food API Docs'
    });

    app.enableCors({
        allowedHeaders: ['x-access-token', 'Content-Type'],
        methods: 'GET,POST,PUT,DELETE',
    });

    await app.init();
    cachedServer = serverless(app.getHttpAdapter().getInstance());
    return cachedServer;
}

export const handler = async (event: any, context: any) => {
    const server = await bootstrap();
    return server(event, context);
};