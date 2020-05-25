## 優先度最高

>また、いくつかのページ編集画面で client-session-schema-json.json のファイル取得に失敗しました

インポート/エクスポート手順の[ページデータのエクスポート手順](https://git.cicd.lakeelcloud.com/applications/services/lakeel-visual-mosaic/documents/-/blob/master/99_%E3%81%9D%E3%81%AE%E4%BB%96/%E5%90%84%E7%A8%AE%E6%89%8B%E9%A0%86/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88%E6%89%8B%E9%A0%86.md#1-5-%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AE%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88)に漏れました。  

下記のコードを robo3T で実行します。

```javascript

// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var clientSessions = db.getCollection('pages').distinct('clientSession.schema', {siteCd:siteCd})
var urls = []
clientSessions.forEach((cs) => {
    urls.push('files/lvm/pages/' + cs.split(/\//g).reverse()[2] + '/' + cs.split(/\//g).reverse()[1])
})
urls
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
上記、JSON の " を ' に変換して、下記の SQL を pgadmin で実行します。SQL 実行結果 (CSV) をダウンロードします。

```sql

-- `page_urls` は、上記、JSON の " を ' に変換した内容に置き換える。

SELECT *
FROM public.file_metadata
WHERE directory IN (page_urls) AND file_name like '%json%';
``` 

## 優先度高

>* メディアの画像が一部表示されない  

[メディアエクスポート手順](https://git.cicd.lakeelcloud.com/applications/services/lakeel-visual-mosaic/documents/-/blob/master/99_%E3%81%9D%E3%81%AE%E4%BB%96/%E5%90%84%E7%A8%AE%E6%89%8B%E9%A0%86/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88%E6%89%8B%E9%A0%86.md#1-3-%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E3%81%AE%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88)の対象は足りないので、以下の操作を行い、メディアを再インポートする必要があります。  

下記のコードを robo3T で実行します。  
```javascript
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
上記、JSON の " を ' に変換して、下記の SQL を pgadmin で実行します。SQL 実行結果 (CSV) をダウンロードします。

```sql

-- `media_urls` は、上記、JSON の " を ' に変換した内容に置き換える。

SELECT *
FROM public.file_metadata
WHERE directory = 'files/lvm/medias'
	AND file_name IN (media_urls);
```

## 優先度中

>- ウィジェットのエクスポート対象が全サイトで利用しているウィジェットになっている

エクスポートロジックを後で修正します。今回はLVM から LWF に不要なウィジェットを削除します。  

```sql
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
if (used_widgets.length > 0) {
    db.getCollection('widgets').remove({$nor:used_widgets})
}
```

---

>Layouts DB のドメインに変なサイトコードが入っている  

これはインポート失敗時の仮のサイトドメインです。削除して良いです。  

postgre DBで下記のコード実行してください。

```sql
DELETE FROM affiliates WHERE domain ~ '[0-9]{13}$';
DELETE FROM error_definition WHERE domain ~ '[0-9]{13}$';
DELETE FROM meta_tags WHERE domain ~ '[0-9]{13}$';
DELETE FROM page_layouts WHERE domain ~ '[0-9]{13}$';
DELETE FROM site_setting WHERE domain ~ '[0-9]{13}$';
DELETE FROM version WHERE domain ~ '[0-9]{13}$';
```  

---

最後  

S3 にアップロードしているファイル一覧を取得して、sh コマンドでファイルをダウンロードします。下記のコードを robo3T で実行します。

```sql
// 実際のサイトのドメインを設定。
var domain = ''
var site = db.getCollection('sites').find({siteIndex:domain})
var siteCd = site[0].siteCd
var urls = []
db.getCollection('medias').find({siteCd:siteCd}).forEach(item => {
    urls.push(item.detailImg.slice(item.detailImg.indexOf('/files')))
    urls.push(item.previewImg.slice(item.previewImg.indexOf('/files')))
})
db.getCollection('pages').distinct('clientSession.schema').forEach((cs) => {
    urls.push('files/lvm/pages/' + cs.split(/\//g).reverse()[2] + '/' + cs.split(/\//g).reverse()[1] + '/' + cs.split(/\//g).reverse()[0])
})
urls
```

以下のように、S3 にアップロードされているファイル一覧を取得できます。

```json

[
    "/files/lvm/medias/ea194b16-8939-45ee-8672-aa1e35e9fccc.png",
    "/files/lvm/medias/bb9f85e5-0b43-436f-b07f-feeb8fa23c0c.png",
    "files/lvm/pages/1583736376429/1/client-session-json-schema.json",
    "files/lvm/pages/1583736874202/1/client-session-json-schema.json",
]
```

以下のコードを .sh ファイルに保存して実行します。

```shell

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

そして[2.インポート](https://git.cicd.lakeelcloud.com/applications/services/lakeel-visual-mosaic/documents/-/blob/master/99_%E3%81%9D%E3%81%AE%E4%BB%96/%E5%90%84%E7%A8%AE%E6%89%8B%E9%A0%86/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88/%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88%E3%83%BB%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88%E6%89%8B%E9%A0%86.md#2-%E3%82%A4%E3%83%B3%E3%83%9D%E3%83%BC%E3%83%88)を実行します。  

@sunada-ke


全サイト利用しないウィジェットを削除sql↓  
```sql
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

>LWF で利用していないウィジェットというよりも、プレビュー画像などがない不整合データのウィジェットを削除する方針にしないといけないかと思います。

不整合データを探したいなら、lvmDBとfileDBを結合して検索する必要があります。「利用しないウィジェットを削除する」このやり方で十分と思います。

>この SQL は、ハードコーディングではなく、SQL の中で対応すべき terminalId を検索して更新かける処理にして欲しいです。というのも、また、別の環境に LWF をインポートした際、このように terminalId を調べる必要が出てくるので。

dev環境で下記のsqlを実行してください↓↓  
```sql
var terminal_list = []
db.getCollection('pageTerminals').find({},{width:1,height:1}).forEach(item => {
    item._id = String(item._id).split('\"')[1].split('\"')[0]
    terminal_list.push(item)
})
terminal_list
```
以下のデータ(terminal_list)を取得します↓↓  
```json
[
    {
        "_id" : "5d2413a22557d23b0a33c5ba",
        "width" : 320,
        "height" : 568
    },
    {
        "_id" : "5d2413a22557d21ad333c5bb",
        "width" : 375,
        "height" : 667
    }
]
```
HC環境で下記のsqlを実行してください↓↓  
```sql
// 実際のterminal_listを入力して
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

@sunada-ke
