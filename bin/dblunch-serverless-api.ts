#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DblunchServerlessApiStack } from '../lib/dblunch-serverless-api-stack';

const app = new cdk.App();
new DblunchServerlessApiStack(app, 'DblunchServerlessApiStack');
