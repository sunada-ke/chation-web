# Overview

`LaKeel Job Scheduler` は、作業単位のスケジュールを設定して、定義した一定の間隔で実行できます。  
作成された各ジョブは、指定のスケジュールに従って `LaKeel Synergy Logic` が管理するマイクロサービスを呼び出します。

また、複数のノードインスタンスからを同じジョブを処理しないようにするため、実行されたジョブは10分間ロックされます。  
これにより、他のジョブプロセッサがジョブ再度実行できないことが保証されます。ジョブが完了すると、自動的にロックは解除されます。

# Example Usage

5分ごとに 死活監視API を実行します。

```typescript
import { WebApiClientFactory, ClientType } from 'lib-web-api-client';

async functionName(arg) {
  const apiclient = WebApiClientFactory.create(ClientType.frontend, this.$lakeelSynergyLogicApiBaseUri);
  const lslConfig = {
    serviceCode: 'lakeel-job-scheduler-api',
    apiCode: 'post_/v1/jobs/{name}/repeat',
    path: {
      name: 'Health Check Job'
    }
  };
  const data =  {
    serviceCode: 'lakeel-job-scheduler-api',
    apiCode: 'get_/v1/health-check',
    interval: '0 */5 * * * *',
    timezone: 'Asia/Tokyo'
  };
  return await apiclient.request({ lslConfig, data });
}
```

# Creating jobs

`LaKeel Job Scheduler` のジョブは、`LaKeel Synergy Logic` に登録された APIを呼び出します。  
3種類の実行方法を提供します。

## 1. 繰り返し実行

繰り返し実行されるジョブを作成します。

| API コード |
| --- |
| post_/v1/jobs/{name}/repeat |

繰り返しスケジュールは cron フォーマット文字列を指定します。
[cron - Wikipedia](https://en.wikipedia.org/wiki/Cron)

## 2. 日時指定実行

指定された日時に実行されるジョブを作成します。

| API コード |
| --- |
| post_/v1/jobs/{name}/schedule |

実行日時を ISO 8601 フォーマット文字列で指定します。[ISO 8601 - Wikipedia](https://en.wikipedia.org/wiki/ISO_8601)

## 3. 即時実行

即時実行されるジョブを作成します。

| API コード |
| --- |
| post_/v1/jobs/{name}/now |

この APIが呼ばれたタイミングでジョブが実行されます。

# Managing Jobs

ジョブの取得、削除、更新 APIの用意があります。

繰り返し実行ジョブのみ、ジョブの変更を行えます。 日時指定実行ジョブ と 即時実行ジョブ の変更はできません。  
まだ実行していない日時指定実行ジョブ（= 実行の予約）を変更する場合は、削除してから再作成してください。

## 1. 全件取得

ジョブを全て取得します。

| API コード |
| --- |
| get_/v1/jobs |

## 2. 1件取得

ジョブを取得します。

| API コード |
| --- |
| get_/v1/jobs/{name} |

## 3. 削除

ジョブを削除します。

| API コード |
| --- |
| delete_/v1/jobs/{name} |

## 4. 更新

繰り返し実行されるジョブを更新します。

| API コード |
| --- |
| put_/v1/jobs/{name}/repeat |

# Logging

ジョブの実行ログがアプリケーションログのログレベル'Info'に記録されます。

| イベント | メッセージ | 備考 |
| --- | --- | --- |
| start | Job '{テナントコード}.{ジョブ名}' starting. |  |
| complete | Job '{テナントコード}.{ジョブ名}' finished. |  |
| success | Job '{テナントコード}.{ジョブ名}' succeeded. |  |
| fail | Job '{テナントコード}.{ジョブ名}' failed.` | エラー情報が出力されます。 |

**<span style="color: red; ">注意</span>**

failイベントは指定されたタイミングで指定されたサービスの呼び出しが失敗した時に出力されます。呼び出したサービス側で発生したエラーではありません。
