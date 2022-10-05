import notify from './notify'
import { getClient, ResponseType } from '@tauri-apps/api/http'

export type GetAidInfoResult = {
  releasedAt: number
  cover: string
  episodes: string[]
  title: string
  isOver: boolean
  aid: string
}

export type SearchNameResult = {
  [animeName: string]: string
}

const client = await getClient()

function getAidInfo(aid: string, clientName: string, clientVersion: number): Promise<GetAidInfoResult> {
  return new Promise((resolve) => {
    client.get<string>(`http://api.anidb.net:9001/httpapi?request=anime&client=${clientName}&clientver=${clientVersion}&protover=1&aid=${aid}`, {
      responseType: ResponseType.Text
    }).then((res) => {
      if (res.ok) {
        const xmldoc = new DOMParser().parseFromString(res.data, 'text/xml')
        
        const cover = xmldoc.querySelector('anime>picture') === null ? '' : `https://cdn-us.anidb.net/images/main/${xmldoc.querySelector('anime>picture')?.innerHTML}`
        const isOver = xmldoc.querySelector('anime>enddate') !== null
        const releasedAt = new Date(xmldoc.querySelector('anime>startdate')?.innerHTML ?? 0).getTime()
        
        const titlesNodes = xmldoc.querySelectorAll('anime>titles>title')
        let title_zh = ''
        let title_jp = ''
        for (let i = 0;i < titlesNodes.length;i++) {
          if (titlesNodes[i].getAttribute('xml:lang') === 'zh-Hans') {
            title_zh = titlesNodes[i].innerHTML
          }
          if (titlesNodes[i].getAttribute('xml:lang')?.includes('jp') && titlesNodes[i].getAttribute('type') === 'official') {
            title_jp = titlesNodes[i].innerHTML
          }
        }

        const episodes: string[] = []
        const episodesNodes = xmldoc.querySelectorAll('anime>episodes>episode')
        for (let i = 0;i < episodesNodes.length;i++) {
          if (episodesNodes[i].querySelector('epno') !== null && episodesNodes[i].querySelector('epno')?.getAttribute('type') === '1') {
            // @ts-ignore
            episodes.push(episodesNodes[i].querySelector('epno')?.innerHTML)
          }
        }
        
        const title = title_zh ?? title_jp
        resolve({ releasedAt, cover, episodes, isOver, title, aid })
      } else {
        notify.negative('请求失败！aid 错误、客户端名称或版本错误')
      }
    }).catch((err) => {
      console.error(err)
      notify.negative('请求失败！网络错误')
    })
  })
}

function searchName(name: string, zhOnly: boolean): Promise<SearchNameResult> {
  return new Promise((resolve) => {
    client.get<SearchNameResult>(`https://anidb.rotcool.me/api/s?content=${name}${zhOnly ? '&lang=zh-Hans' : ''}`, {
      responseType: ResponseType.JSON
    }).then((res) => {
      if (res.ok) {
        resolve(res.data)
      } else {
        notify.negative('请求失败！网络错误')
      }
    }).catch((err) => {
      console.error(err)
      notify.negative('请求失败！网络错误')
    })
  })
}

function downloadImg(url: string): Promise<Uint8Array> {
  return new Promise((resolve) => {
    client.get<Uint8Array>(url, {
      responseType: ResponseType.Binary
    }).then((res) => {
      if (res.ok) {
        console.log('test')
        resolve(res.data)
      } else {
        notify.negative('图片下载失败！网络错误')
      }
    }).catch((err) => {
      console.error(err)
      notify.negative('图片下载失败！网络错误')
    })
  })
}

export default { getAidInfo, searchName, downloadImg }
