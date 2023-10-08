# Nestjs Elasticsearch Module

> [!NOTE]  
> This repository is a Work In Progress, driven by the motive.

## Motive

Due to Production Experience when working with Elasticsearch leaded to maintenance issues when extensively used searches, filters and aggregations (especially aggregations).

1. Current Elasticsearch Nestjs Modules does not provide auto-complete for queries
2. Since Elasticsearch indexes are schema-less we got no proper feedback about what we should expect on the index
3. Elasticsearch response forgets about types of aggregations

## Adding package to your Nestjs project

1. Install package using yarn or npm

```bash
$ yarn add @codemaskjs/nestjs-elasticsearch
// or
$ npm -i @codemaskjs/nestjs-elasticsearch
```
2. Import module

```typescript
import { ElasticsearchModule } from '@codemaskjs/nestjs-elasticsearch'

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200'
        })
    ]
})
class AppModule {}
```

3. (optional) Registering Index with Document

```typescript
import { RegisterIndex } from '@codemaskjs/nestjs-elasticsearch'

@RegisterIndex('examples')
export class ExampleDocument {
    readonly id: string
    readonly test?: string
}
```

```typescript
import { ElasticsearchModule } from '@codemaskjs/nestjs-elasticsearch'
import { ExampleDocument } from './example.document'

@Module({
    imports: [
        ElasticsearchModule.register({
            node: 'http://localhost:9200'
        }),
        ElasticsearchModule.forFeature([
            ExampleDocument
        ])
    ]
})
class AppModule {}
```
