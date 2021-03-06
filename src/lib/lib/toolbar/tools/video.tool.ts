import { ToolForm } from '../forms/tool-form';
import { AttrType } from '../forms/help';
import { VideoComponent, PreComponent } from '../../components/_api';
import { VideoCommander } from '../commands/video.commander';
import { MediaMatcher } from '../matcher/media.matcher';
import { Toolkit } from '../toolkit/toolkit';

export const videoTool = Toolkit.makeDropdownTool({
  classes: ['textbus-icon-video'],
  tooltip: '视频',
  menuFactory() {
    return new ToolForm([{
      type: AttrType.TextField,
      label: '视频链接地址',
      name: 'src',
      required: true,
      placeholder: '请输入链接地址',
      canUpload: true,
      uploadType: 'video',
      uploadBtnText: '上传新视频'
    }, {
      type: AttrType.Hidden,
      name: 'controls',
      value: 'controls'
    }, {
      type: AttrType.TextField,
      label: '视频宽度',
      name: 'width',
      required: false,
      placeholder: '支持任意 CSS 单位',
      value: '100%'
    }, {
      type: AttrType.TextField,
      label: '视频高度',
      name: 'height',
      required: false,
      placeholder: '支持任意 CSS 单位',
      value: 'auto'
    }, {
      type: AttrType.Switch,
      label: '自动播放',
      required: true,
      checked: false,
      name: 'autoplay'
    }]);
  },
  matcher: new MediaMatcher(VideoComponent, 'video', [PreComponent]),
  commanderFactory() {
    return new VideoCommander();
  }
});
