import { RemovalPolicy } from '@aws-cdk/core';

export const makeId = (string: string): string => `${string}-${process.env.ENVIRONMENT}`;

export const getRemovalPolicy = () =>
    process.env.ENVIRONMENT === 'PRODUCTION' ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY;
