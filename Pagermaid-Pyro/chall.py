import re
import time

from pyrogram.types import Message

from pagermaid.listener import listener
from pagermaid.utils import client as http_client, alias_command


# 此版本是修改版，原版作者我也不知道是谁


def convert_time_to_str(ts):
    return str(ts).zfill(2)


def sec_to_data(y):
    h = int(y // 3600 % 24)
    d = int(y // 86400)
    h = convert_time_to_str(h)
    d = convert_time_to_str(d)
    return d + "天" + h + "小时"


def StrOfSize(size):
    def strofsize(integer, remainder, level):
        if integer >= 1024:
            remainder = integer % 1024
            integer //= 1024
            level += 1
            return strofsize(integer, remainder, level)
        elif integer < 0:
            integer = 0
            return strofsize(integer, remainder, level)
        else:
            return integer, remainder, level

    units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    integer, remainder, level = strofsize(size, 0, 0)
    if level + 1 > len(units):
        level = -1
    return ('{}.{:>03d} {}'.format(integer, remainder, units[level]))


@listener(is_plugin=True, outgoing=True, command=alias_command("cha"),
          description='识别订阅链接并获取信息\n使用方法：使用该命令发送或回复一段带有一条或多条订阅链接的文本',
          parameters='<url>')
async def subinfo(_, msg: Message):
    headers = {
        'User-Agent': 'ClashforWindows/0.18.1'
    }
    try:
        message_raw = msg.reply_to_message and (msg.reply_to_message.caption or msg.reply_to_message.text) or (msg.caption or msg.text)
        await msg.edit('信息获取中')
        final_output = ''
        url_list = re.findall("https?://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]",
                              message_raw)  # 使用正则表达式查找订阅链接并创建列表
        for url in url_list:
            try:
                res = await http_client.get(url, headers=headers, timeout=5)  # 设置5秒超时防止卡死
                while res.status_code == 301 or res.status_code == 302:
                    url1 = res.headers['location']
                    res = await http_client.get(url1, headers=headers, timeout=5)
            except:
                final_output = final_output + '连接错误' + '\n\n'
                continue
            if res.status_code == 200:
                try:
                    info = res.headers['subscription-userinfo']
                    info_num = re.findall('\d+', info)
                    time_now = int(time.time())
                    output_text_head = '订阅链接：`' + url + '`\n已用上行：`' + StrOfSize(
                        int(info_num[0])) + '`\n已用下行：`' + StrOfSize(int(info_num[1])) + '`\n剩余：`' + StrOfSize(
                        int(info_num[2]) - int(info_num[1]) - int(info_num[0])) + '`\n总共：`' + StrOfSize(
                        int(info_num[2]))
                    if len(info_num) >= 4:
                        timeArray = time.localtime(int(info_num[3]) + 28800)
                        dateTime = time.strftime("%Y-%m-%d", timeArray)
                        if time_now <= int(info_num[3]):
                            lasttime = int(info_num[3]) - time_now
                            output_text = output_text_head + '`\n此订阅将于`' + dateTime + '`过期' + '，剩余`' + sec_to_data(
                                lasttime) + '`'
                        elif time_now > int(info_num[3]):
                            output_text = output_text_head + '`\n此订阅已于`' + dateTime + '`过期！'
                    else:
                        output_text = output_text_head + '`\n到期时间：`未知`'
                except:
                    output_text = '无流量信息'
            else:
                output_text = '无法访问'
            final_output = final_output + output_text + '\n\n'
        await msg.edit(final_output)
    except:
        await msg.edit('参数错误')
