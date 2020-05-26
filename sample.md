# インポート・エクスポート手順

Ver.2.2.2 より、サイトのインポートとエクスポートが可能になりました。Visual Mosaic にアップロードした各種リソースファイル (ウィジェット/JS/CSS/Media) に関しては、別途エクスポートとインポートをインフラ作業として行う必要があります。それらの手順を下記に記載しています。

------

## 1. 事前準備

### サービスアカウントの作成

Visual Mosaic のデータベースにインポート処理を行う Passport のサービスアカウントのクレデンジャル情報を登録する必要があります。[サービスアカウントの作成方法](https://git.cicd.lakeelcloud.com/applications/services/lakeel-visual-mosaic/documents/-/blob/master/99_%E3%81%9D%E3%81%AE%E4%BB%96/%E5%90%84%E7%A8%AE%E6%89%8B%E9%A0%86/%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88/%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E4%BD%9C%E6%88%90%E6%89%8B%E9%A0%86.md) を参照して、サービスアカウントを作成してください。

### Ver.2.2.2 マイグレーションパッチの実行

また、Visual Mosaic Ver.2.2.2 のマイグレーションスクリプトに不具合がありました。現時点 (2020/5/22) では、Ver.2.2.2 のマイグレーションスクリプトは修正されましたが、それ以前に Ver.2.2.2 にマイグレーションした環境に対しては、以下の SQL を lakeel-files-database に対して実行する必要があります。

```sql
DELETE
FROM public.file_metadata
WHERE file_name = 'index_detail.png'
  AND directory LIKE '%widgets%'
  AND (directory || '/1.0') IN
   (SELECT directory 
        FROM public.file_metadata f 
        WHERE f.file_name = 'index_detail.png' 
        AND f.directory LIKE '%/1.0');
									
DELETE
FROM public.file_metadata
WHERE file_name = 'index_preview.png'
  AND directory LIKE '%widgets%'
  AND (directory || '/1.0') IN
   (SELECT directory 
        FROM public.file_metadata f 
        WHERE f.file_name = 'index_preview.png' 
        AND f.directory LIKE '%/1.0');


UPDATE public.file_metadata
   SET directory = directory || '/1.0'
 WHERE (file_name = 'index_detail.png' or file_name = 'index_preview.png')
   AND directory LIKE '%widgets%'
   AND directory !~ '/[0-9.0-9]+$';
```

## 2. Visual Mosaic でエクスポート

データ移行元の Visual Mosaic にアクセスして、ツール > エクスポートより、サイトを選択してエクスポートして、Visual Mosaic のデータベースの zip ファイルを S3 にアップロードします。

また、ネットワークの制約により、環境間で通信を行えない場合に関しては、エクスポートした zip ファイルを手動でインポート先の環境の S3 に移行し、lakeel-files-database に関連データを登録する必要があります。エクスポートした環境の lakeel-files-database のデータのバケット名を変更し、インポート先環境の lakeel-files-database に追加してください。

```sql
-- `directory` にはエクスポートパス、`bucket_name` にはインポート環境の S3 のバケット名を設定する。
select * from file_metadata where directory = 'xxx' and bucket_name = 'xxx' order by update_date desc;

--上記 SELECT した結果のバケット名 (`bucket_name`) を変更したものを VALUES に設定
INSERT INTO public.file_metadata(
	file_id, tenant_code, service_code, bucket_name, directory, file_name, size, hash, ttl, create_date, create_user_id, update_date, update_user_id)
	VALUES ();
```

```sql
-- `directory` にはエクスポートパス、`bucket_name` にはエクスポート環境の S3 のバケット名を設定する。
select * from file_metadata where directory = 'xxx' and bucket_name = 'xxx' order by update_date desc;

--上記 SELECT した結果のバケット名 (`bucket_name`) を変更したものを VALUES に設定
INSERT INTO public.file_metadata(
file_id, tenant_code, service_code, bucket_name, directory, file_name, size, hash, ttl, create_date, create_user_id, update_date, update_user_id)
VALUES ();
```

## 3. Visual Mosaic でインポート

**後続手順の都合上、先に S3 にアップロードされた zip ファイルのインポートを行います。**  

**インポート時は、OOM を防ぐため、lakeel-layouts-api の Node.js のメモリ割り当てを増やしてください。export NODE_OPTIONS=--max_old_space_size=4096 でメモリ割り当てを増やせます。**

```bash
kubectl edit deployment lakeel-visual-mosaic-layouts-api --namespace=lakeel-visual-mosaic

        - name: NODE_OPTIONS
          value: --max_old_space_size=1024
```

データ移行先の Visual Mosaic にアクセスして、ツール > インポートより、以下の情報を入力してインポートします。

- 新しいサイトドメイン: データ移行先のサイトドメイン
- エクスポートファイルパス: エクスポートした zip のファイルパス (データ移行元の Visual Mosaic のツール > エクスポート参照)

**インポート成功後、後続手順で利用するため、サイトコードを控えてください。**

## 4. LaKeel Files のウィジェット関連データのエクスポート

エクスポート対象のサイトで利用しているウィジェットを抽出します。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var used_widgets = []
db.getCollection('pages').distinct('widgets',{siteCd:siteCd}).forEach(widget => {
    if (widget.widgetId && widget.version && typeof widget.widgetId === 'string' && typeof widget.version === 'string') {
          used_widgets.push(widget)
    }
})
var widget_urls = []
if (used_widgets.length > 0) {
    db.getCollection('widgets').find({$or:used_widgets},{_id:0,url:1}).forEach(item => {
        widget_urls.push(item.url.slice(item.url.indexOf('/files/') + 1,item.url.lastIndexOf('/')))
    })
}
widget_urls
```

以下のように、サイトで利用しているウィジェットを取得できます。

```json
[
    "files/lvm/widgets/system/w0ac3443915444102bd52a1f79334e167/1.0",
    "files/lvm/widgets/system/w13bbe3e7108849e29b8c014759d2bce0/1.0",
    "files/lvm/widgets/system/wef8ea495e04541f4961c7b4dd0485a58/1.0"
]
```

また、ファイル基盤の DB からウィジェット関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `widget_urls` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, directory, file_name, size, hash, ttl
	, create_date, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE directory IN (widget_urls);
```

## 5. LaKeel Files のメディア関連データのエクスポート

エクスポート対象のサイトで利用しているメディアを抽出します。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var media_urls = []
db.getCollection('medias').find({siteCd:siteCd}).forEach(item => {
    media_urls.push(item.detailImg.slice(item.detailImg.lastIndexOf('/') + 1))
    media_urls.push(item.previewImg.slice(item.previewImg.lastIndexOf('/') + 1))
})
media_urls
```

以下のように、サイトで利用しているメディアを取得できます。

```json
[
    "f2bb9c0c-637c-4a46-a321-a37654333bef.png",
    "15985186-438c-4629-aff7-5589931cb703.png",
    "f411c600-4236-415d-9c1b-b88d2651a9cf.png",
]
```

また、ファイル基盤の DB からメディア関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `media_urls` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, directory, file_name, size, hash, ttl
	, create_date, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE directory = 'files/lvm/medias'
	AND file_name IN (media_urls);
```

## 6. LaKeel Files のコンテンツ関連データのエクスポート

エクスポート対象のサイトで利用しているコンテンツを抽出します。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var contentIds = db.getCollection('pages').distinct('contents',{siteCd:siteCd})
var content_urls = []
if (contentIds.length > 0) {
    db.getCollection('contents').find({$or:contentIds,siteCd:siteCd}).forEach(item => {
        content_urls.push(item.detailImg.slice(item.detailImg.lastIndexOf('/') + 1))
        content_urls.push(item.previewImg.slice(item.previewImg.lastIndexOf('/') + 1))
    })
}
content_urls
```

以下のように、サイトで利用しているコンテンツを取得できます。

```json
[
    "fd4d56a2-88e1-46d9-97ec-6b575ffe94b4.blob",
    "b146d409-cdbe-4df2-8492-0b5e3a2c40a5.png",
    "25172bd0-4c30-46fb-968b-4775ea16ca78.blob",
]
```

また、ファイル基盤の DB からコンテンツ関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `content_urls` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, directory, file_name, size, hash, ttl
	, create_date, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE file_name IN (content_urls);
```

## 7. LaKeel Files のページ関連データのエクスポート

エクスポート対象のサイトで利用しているページ関連データ (サムネイル、クライアントセッションスキーマなど) を抽出します。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var page_images = []
db.getCollection('pages').find({siteCd:siteCd},{previewImg:1,detailImg:1}).forEach(item => {
    page_images.push(item.detailImg.slice(item.detailImg.lastIndexOf('/') + 1))
    page_images.push(item.previewImg.slice(item.detailImg.lastIndexOf('/') + 1))
})
db.getCollection('templates').find({siteCd:siteCd},{previewImg:1,detailImg:1}).forEach(item => {
    page_images.push(item.detailImg.slice(item.detailImg.lastIndexOf('/') + 1))
    page_images.push(item.previewImg.slice(item.detailImg.lastIndexOf('/') + 1))
})
page_images
```

以下のように、サイトで利用しているページデータを取得できます。

```json
[
    "d8379ec8-d68d-4376-8884-63a797bfd292.blob",
    "3f8e9036-9625-4d16-bea2-708df62c8ff9.png",
    "bfa85531-3937-4ac4-8c3c-8103a43f1ff1.blob",
]
```

また、ファイル基盤の DB からページ関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `page_images` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, directory, file_name, size, hash, ttl
	, create_date, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE directory = 'files/lvm/pages'
	AND file_name IN (page_images);
```

また、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var page_urls = []
db.getCollection('pages').find({siteCd:siteCd},{pageCss:1,js:1,previewImg:1,detailImg:1}).forEach(item => {
    if (item.pageCss.length > 0) {
        item.pageCss.forEach(css => {
            if (page_urls.indexOf(css.url) === -1) {
                var temp_url = css.url.slice(css.url.indexOf('/files') + 1,css.url.lastIndexOf('/'))
                if (page_urls.indexOf(temp_url) === -1) page_urls.push(temp_url)
            }
        })
    }
    if (item.js.length > 0) {
        item.js.forEach(js => {
            if (!js.isSiteJs && page_urls.indexOf(js.url) === -1) {
                var temp_url = js.url.slice(js.url.indexOf('/files') + 1,js.url.lastIndexOf('/'))
                if (page_urls.indexOf(temp_url) === -1) page_urls.push(temp_url)
            }
        })
    }
})
var clientSessions = db.getCollection('pages').distinct('clientSession.schema', {siteCd:siteCd})
clientSessions.forEach((cs) => {
    page_urls.push(cs.slice(cs.indexOf('/files') + 1,cs.lastIndexOf('/')))
})
page_urls
```

以下のように、サイトで利用しているページデータを取得できます。

```json
[
    "files/lvm/pages/1568961152153/1",
    "files/lvm/pages/1574056223079/1",
    "files/lvm/pages/1574056283449/1",
]
```

また、ファイル基盤の DB からページ関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `page_urls` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, directory, file_name, size, hash, ttl
	, create_date, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE directory IN (page_urls);
```

## 8. LaKeel Files のサイト JS/サイト CSS 関連データのエクスポート

エクスポート対象のサイトで利用しているサイト JS/サイト CSS を抽出します。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var site_urls = []
db.getCollection('siteCss').find({siteCd:siteCd},{url:1}).forEach(item => {
    site_urls.push(item.url.slice(item.url.indexOf('/files/') + 1,item.url.lastIndexOf('/')))
})
db.getCollection('siteJs').find({siteCd:siteCd},{url:1}).forEach(item => {
    site_urls.push(item.url.slice(item.url.indexOf('/files/') + 1,item.url.lastIndexOf('/')))
})
site_urls
```

以下のように、サイトで利用している JS/CSS を取得できます。

```json
[
    "files/lvm/sites/master/1583458866363/siteCss/1",
    "files/lvm/sites/master/1583458866363/siteCss/1",
    "files/lvm/sites/master/1583458866363/siteCss/1",
]
```

また、ファイル基盤の DB からページ関連のデータをエクスポートします。  
上記、JSON の " を ' に変換し、エクスポートした環境の lakeel-files-database に対して、下記の SQL を実行します。そして、SQL 実行結果 (CSV) をダウンロードします。ダウンロードした CSV は手順 10 で利用します。

```sql
-- `site_urls` は、上記、JSON の " を ' に変換した内容に置き換える。
-- `old_bucket_name` にはエクスポート環境の S3 バケット名、`new_bucket_name` にはインポート環境の S3 バケット名で置換してください。
-- `old_site_cd` にはエクスポート環境のサイトコード、`new_site_cd`  にはインポート環境のサイトコードで置換してください。
SELECT file_id, tenant_code, service_code
	, replace(bucket_name, old_bucket_name, new_bucket_name)
	, replace(directory, old_site_cd, new_site_cd) AS directory
	, file_name, size, hash, ttl, create_date
	, create_user_id, update_date, update_user_id
FROM public.file_metadata
WHERE directory IN (site_urls);
```

##  9. S3 のファイルのダウンロード

S3 にアップロードしているファイル一覧を取得して、sh コマンドでファイルをダウンロードします。エクスポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var urls = []
db.getCollection('pages').find({siteCd:siteCd},{pageCss:1,js:1,previewImg:1,detailImg:1}).forEach(item => {
    if (item.pageCss.length > 0) {
        item.pageCss.forEach(css => {
            if (urls.indexOf(css.url) === -1) {
                var temp_url = css.url.slice(css.url.indexOf('/files'))
                if (urls.indexOf(temp_url) === -1) urls.push(temp_url)
            }
        })
    }
    if (item.js.length > 0) {
        item.js.forEach(js => {
            if (!js.isSiteJs && urls.indexOf(js.url) === -1) {
                var temp_url = js.url.slice(js.url.indexOf('/files'))
                if (urls.indexOf(temp_url) === -1) urls.push(temp_url)
            }
        })
    }
})
var used_widgets = []
db.getCollection('pages').distinct('widgets',{siteCd:siteCd}).forEach(widget => {
    if (widget.widgetId && widget.version && typeof widget.widgetId === 'string' && typeof widget.version === 'string') {
          used_widgets.push(widget)
    }
})
if (used_widgets.length > 0) {
    db.getCollection('widgets').find({$or:used_widgets},{_id:0,url:1,previewImg:1,detailImg:1,map:1}).forEach(item => {
        urls.push(item.url.slice(item.url.indexOf('/files')))
        urls.push(item.previewImg.slice(item.previewImg.indexOf('/files')))
        urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
        if (item.map) urls.push(item.map.slice(item.map.indexOf('/files')))
    })
}
db.getCollection('medias').find({siteCd:siteCd}).forEach(item => {
    urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
    urls.push(item.previewImg.slice(item.previewImg.indexOf('/files')))
})
var contentIds = db.getCollection('pages').distinct('contents',{siteCd:siteCd})
if (contentIds.length > 0) {
    db.getCollection('contents').find({$or:contentIds,siteCd:siteCd}).forEach(item => {
        urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
        urls.push(item.previewImg.slice(item.previewImg.indexOf('/files')))
    })
}
db.getCollection('pages').find({siteCd:siteCd},{previewImg:1,detailImg:1}).forEach(item => {
    urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
    urls.push(item.previewImg.slice(item.detailImg.indexOf('/files')))
})
db.getCollection('templates').find({siteCd:siteCd},{previewImg:1,detailImg:1}).forEach(item => {
    urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
    urls.push(item.previewImg.slice(item.detailImg.indexOf('/files')))
})
db.getCollection('siteCss').find({siteCd:siteCd},{url:1}).forEach(item => {
    urls.push(item.url.slice(item.url.lastIndexOf('/files')))
})
db.getCollection('siteJs').find({siteCd:siteCd},{url:1}).forEach(item => {
    urls.push(item.url.slice(item.url.lastIndexOf('/files')))
})
db.getCollection('pages').distinct('clientSession.schema').forEach(item => {
    urls.push(item.slice(item.indexOf('/files')))
})
urls
```

以下のように、S3 にアップロードされているファイル一覧を取得できます。

```json
[
    "/files/lvm/widgets/system/w0ac3443915444102bd52a1f79334e167/1.0/index.js",
    "/files/lvm/medias/f2bb9c0c-637c-4a46-a321-a37654333bef.png",
    "/files/lvm/contents/master/1562645539322/fd4d56a2-88e1-46d9-97ec-6b575ffe94b4.blob",
    "/files/lvm/pages/3f8e9036-9625-4d16-bea2-708df62c8ff9.png",
    "/files/lvm/sites/master/1583458866363/siteCss/1/modeler.css",
]
```

以下のコードを .sh ファイルに保存して実行し、ローカル PC に S3 のファイルをダウンロードします。そして、ダウンロードしたファイルのサイトコードを変更します。

```bash
#!/bin/bash

# S3 のファイルダウンロード先のローカルディレクトリ。
local_file_base=''

# 上記の JSON の , を削除して、file_list に置き換える。
file_list=(
)

# S3 バケットパス。(例: s3://commerce-public.dev.lakeelcloud.com)
s3_base_bucket=

# create directory
if [ ! -d $local_file_base ];then
mkdir $local_file_base
fi

for file_src in ${file_list[@]};do
file_dir=${file_src%/*}
if [ ! -d $s3_base_bucket$file_dir ];then
mkdir -p $s3_base_bucket$file_dir
fi
aws s3 cp $s3_base_bucket$file_src $local_file_base$file_src
done
read -p "files download end"
```

## 10. CSV ファイルインポート

手順 4 ~ 手順 8 の手順でエクスポートした CSV をすべて LaKeel Files の DB にインポートします。CSV インポート時は、下図の設定を行なって実行してください。(CSV のヘッダ順も一致させておく必要があります。)

![import-csv-to-files-1.png](./images/import-csv-to-files-1.png)

![import-csv-to-files-1.png](./images/import-csv-to-files-2.png)

## 10. S3 にファイルアップロード

手順 8 のディレクトリ (local_file_base) の中の全てのファイルを S3 にアップロードします。

## 11. 不要なウィジェットの削除

エクスポート機能の不具合により、エクスポートしたサイトに関係ないウィジェットも zip ファイルに含まれてしまいます。インポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行して、不要なウィジェットを削除します。

```js
// 全サイトで利用していないウィジェットを削除する。
var used_widgets = []
db.getCollection('pages').distinct('widgets').forEach(widget => {
    if (widget.widgetId && widget.version && typeof widget.widgetId === 'string' && typeof widget.version === 'string') {
          used_widgets.push(widget)
    }
})
if (used_widgets.length > 0) {
    db.getCollection('widgets').remove({$nor:used_widgets})
}
```

##  12. デバイス設定情報の修正

エクスポート機能の不具合により、ページ編集画面のデバイス設定情報が正しく zip ファイルに含まれないため、修正用の各種コマンドを実行します。まずは、以下のコードをエクスポートした環境の lakeel-visual-mosaic-database に対して実行します。

```js
var terminal_list = []
db.getCollection('pageTerminals').find({},{width:1,height:1}).forEach(item => {
    item._id = String(item._id).split('\"')[1].split('\"')[0]
    terminal_list.push(item)
})
terminal_list
```

以下のように、デバイス設定情報を取得できます。

```json
[
    {
        "_id" : "5c99f580d0f8e8f8d01ae6cd",
        "width" : 320,
        "height" : 568
    },
    {
        "_id" : "5c99f580d0f8e801701ae6cf",
        "width" : 414,
        "height" : 736
    },
    {
        "_id" : "5c99f580d0f8e80b0c1ae6d0",
        "width" : 375,
        "height" : 812
    }
]
```

インポートした環境の lakeel-visual-mosaic-database に対して、以下のコードを実行します。

```js
// `terminal_list` は、上記、JSON を設定する。
var terminal_list = []
function findTerminalId(terminal, terminals){
    var terminalId = terminal._id
    terminals.forEach(item => {
        if (terminal.width === item.width && terminal.height === item.height) {
            terminalId = item._id
        }
    })
    return terminalId
}
var hc_terminals = []
db.getCollection('pageTerminals').find({},{width:1,height:1}).forEach(item => {
    item._id = String(item._id).split('\"')[1].split('\"')[0]
    hc_terminals.push(item)
})
terminal_list.forEach(terminal => {
    var hc_terminalId = findTerminalId(terminal, hc_terminals)
    db.getCollection('pages').update({'terminalId':terminal._id},{$set:{'terminalId':hc_terminalId}},false,true)
})
```
