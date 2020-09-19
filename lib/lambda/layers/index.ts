import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';

interface Layers {
    datefns: lambda.LayerVersion;
    lodash: lambda.LayerVersion;
    faker: lambda.LayerVersion;
}

const Layers = (scope: cdk.Stack): Layers => {
    const datefns = new lambda.LayerVersion(scope, 'date-fns', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'layers', 'date-fns')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_10_X]
    });
    const lodash = new lambda.LayerVersion(scope, 'lodash', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'layers', 'lodash')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_10_X]
    });
    const faker = new lambda.LayerVersion(scope, 'faker', {
        code: new lambda.AssetCode(path.join('lib', 'lambda', 'layers', 'faker')),
        compatibleRuntimes: [lambda.Runtime.NODEJS_10_X]
    });

    return { datefns, lodash, faker };
};

export default Layers;
