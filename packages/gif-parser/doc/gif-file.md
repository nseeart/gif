


## GIF里有什么

网上充斥着GIF图片文件.
它是一种广受欢迎的光栅图像格式。
我发现需要探索这些图像的确切组成部分，以便我能够以编程方式阅读和创建自己的代码。
我发现这些简单的文件非常有趣。
我想我会分享我所学到的。
我将信息分为以下 4 部分：


- 位和字节 - 首先我们看看组成 GIF 文件的文件格式
- LZW 图像数据 - 仔细研究如何在 GIF 文件中压缩图像数据
- 透明度和动画 - GIF 文件的一些更“高级”的功能是如何工作的
- GIF 资源管理器 - 在浏览器中解码 GIF 文件以查看不同部分

> 注意：在本指南中，我将查看组成 GIF 文件的字节。 如果您想在家中学习，您可能需要某种十六进制编辑器。 我在 Windows 机器上使用 XVI32 并在 Mac 上使用 HexFiend 取得了成功。 这两个应用程序都是免费的。 


我们将首先浏览 GIF 文件的不同部分。 （此页面上的信息主要来自 W3C GIF89a 规范。）一个 GIF 文件由一堆不同的数据“块”组成。 下图显示了所有不同类型的块以及它们在文件中的位置。 该文件从左侧开始并在右侧工作。 在每个分支，您可以走一条路或另一条路。 大的“中间”部分可以根据需要重复多次。 （从技术上讲，它也可以完全省略，但我无法想象没有图像数据的 GIF 文件会有多好。）

图片


我将通过一个示例 GIF 文件向您展示这些块的外观。 您可以在下面看到示例文件及其相应的字节。



- Header Block - 标题块
- Logical Screen Descriptor - 逻辑屏幕描述符

逻辑屏幕描述符总是紧跟在标题之后。这个块告诉解码器这个图像将占用多少空间。它正好是七个字节长。它从画布宽度开始。该值可以在前两个字节中找到。它以一种称为规范的格式保存，简单地称为无符号。基本上，我们正在查看一个 16 位的非负整数 (0-65,535)。与 GIF 格式中的所有其他多字节值一样，首先存储最低有效字节（小端格式）。这意味着我们将从字节流中读取 0A 00 的位置，我们通常会将其写为 000A，这与 10 相同。因此我们的示例图像的宽度为 10 像素。作为另一个示例，255 将存储为 FF 00 但 256 将存储为 00 01 。正如您所料，画布高度如下。同样，在此示例中，我们可以看到此值为 0A 00，即 10。

接下来我们有一个压缩字节。这意味着该字节实际上在其位中存储了多个值。在这种情况下，字节 91 可以表示为二进制数 10010001。（Windows 内置计算器在将数字转换为十六进制和二进制格式时实际上非常有用。请确保它处于“科学”或“程序员”模式，具体取决于您拥有的 Windows 版本。）第一个（最重要的）位是全局颜色表标志。如果它是 0，那么就没有。如果它是 1，那么将跟随一个全局颜色表。在我们的示例图像中，我们可以看到我们将有一个全局颜色表（通常是这种情况）。接下来的三位代表颜色分辨率。规范说这个值“是原始图像可用的每种原色的位数，减去 1”和“......表示从中选择图形中颜色的整个调色板的大小。”因为我不太了解它的作用，所以我会向您指出一篇关于位和颜色深度的知识渊博的文章。现在 1 似乎有效。注意001代表2位/像素； 111 表示 8 位/像素。下一个位是排序标志。如果值为 1，则全局颜色表中的颜色按“重要性递减”的顺序排序，这通常意味着图像中的“频率递减”。这可以帮助图像解码器，但不是必需的。我们的值一直保持为 0。最后三位是全局颜色表的大小。好吧，那是谎言；这不是桌子的实际大小。如果此值为 N，则实际表大小为 2^(N+1)。从我们的示例文件中，我们得到三位 001，它是 1 的二进制版本。我们实际的表大小将是 2^(1+1) = 2^2 = 4。（我们已经多次提到全局颜色表有了这个字节，我们将在下一节讨论它是什么。）

下一个字节为我们提供了背景颜色索引。该字节仅在全局颜色表标志为 1 时才有意义。它表示全局颜色表中的哪种颜色（通过指定其索引）应用于图像数据中未指定值的像素。如果碰巧没有全局颜色表，则该字节应为 0。

逻辑屏幕描述符的最后一个字节是像素纵横比。我不确定这个值有什么作用。我见过的大多数图像都将此值设置为 0。规范说，如果在此字节中指定了一个值 N，对于所有 N<>0，实际使用的比率将为 (N + 15) / 64 .
- Global Color Table - 全局颜色表

我们已经多次提到全局颜色表，现在让我们谈谈它实际上是什么。 您可能已经知道，每个 GIF 都有自己的调色板。 也就是说，它有一个包含图像中所有颜色的列表，并且不能包含不在该列表中的颜色。 全局颜色表是存储颜色列表的地方。 每种颜色都存储在三个字节中。 每个字节代表一个 RGB 颜色值。 第一个字节是红色 (0-255) 的值，接下来是绿色，然后是蓝色。 全局颜色表的大小由逻辑屏幕描述符的压缩字节中的值决定。 如前所述，如果该字节的值为 N，则实际存储的颜色数为 2^(N+1)。 这意味着全局颜色表将在流中占用 3*2^(N+1) 个字节。

- Graphics Control Extension - 图形控制扩展

图形控制扩展块经常用于指定透明度设置和控制动画。 它们是完全可选的。 由于透明度和动画有点复杂，我将推迟到后面的部分（参见透明度和动画）来讨论这个块的许多细节。 为了让这个页面完整，我至少会告诉你字节代表什么。

第一个字节是扩展介绍人。 所有扩展块都以 21 开头。接下来是图形控件标签 F9，该值表示这是图形控件扩展。 第三个是以字节为单位的总块大小。 接下来是一个打包的字段。 位 1-3 保留供将来使用。 位 4-6 表示处置方法。 倒数第二位是用户输入标志，最后一位是透明颜色标志。 延迟时间值跟随在以无符号格式存储的接下来的两个字节中。 之后我们有透明颜色索引字节。 最后我们有块终止符，它总是 00。

- Image Descriptor - 图像描述符

单个 GIF 文件可能包含多个图像（在创建动画图像时很有用）。每个图像都以一个图像描述符块开始。这个块正好是 10 个字节长。

第一个字节是图像分隔符。每个图像描述符都以值 2C 开头。接下来的 8 个字节代表下图的位置和大小。流中的图像可能不一定占据逻辑屏幕描述符定义的整个画布大小。因此，图像描述符指定图像应在画布上开始的图像左侧位置和图像顶部位置。接下来它指定图像宽度和图像高度。这些值中的每一个都采用两字节无符号格式。我们的示例图像表明图像从 (0,0) 开始，宽 10 像素，高 10 像素。 （此图像确实占据了整个画布大小。）

最后一个字节是另一个压缩字段。在我们的示例文件中，此字节为 0，因此所有子值都为零。字节中的第一个（最重要的）位是本地颜色表标志。将此标志设置为 1 允许您指定后面的图像数据使用与全局颜色表不同的颜色表。 （有关本地颜色表的更多信息如下。）第二位是隔行标志。

- Image Data - 图像数据

最后我们得到了实际的图像数据。图像数据由一系列输出代码组成，这些代码告诉解码器将哪些颜色吐出到画布上。这些代码组合成组成块的字节。我已经设置了一个完整的其他部分，将这些输出代码解码为图像（请参阅 LZW 图像数据）。在此页面上，我将告诉您如何确定块的长度。

该块的第一个字节是 LZW 最小代码大小。该值用于解码压缩的输出代码。 （同样，请参阅有关 LZW 压缩的部分以了解其工作原理。）其余字节表示数据子块。数据子块是 1 - 256 字节的组。子块中的第一个字节告诉您实际数据的字节数。这可以是从 0 (00) 到 255 (FF) 的值。在你读完这些字节之后，你读到的下一个字节会告诉你现在跟在那个字节之后还有更多的数据字节。您继续阅读，直到到达一个表示后面跟着零字节的子块。

您可以看到我们的示例文件的 LZW 最小代码大小为 2。下一个字节告诉我们它后面有 22 个字节的数据（16 hex = 22）。在我们读取了这 22 个字节后，我们看到下一个值为 0。这意味着后面没有字节并且我们已经读取了该块中的所有数据。

- Plain Text Extension - 纯文本扩展

奇怪的是，规范允许您指定希望在图像上呈现的文本。 我按照规范查看是否有任何应用程序可以理解此命令； 但是 IE、FireFox 和 Photoshop 都无法渲染文本。 我不会解释所有的字节，而是告诉你如何识别这个块并跳过它

与所有扩展块类型一样，块以扩展引入器开始。 该值始终为 21。下一个字节是纯文本标签。 此值 01 用于将纯文本扩展名与所有其他扩展名区分开来。 下一个字节是块大小。 这会告诉您在实际文本数据开始之前还有多少字节，或者换句话说，您现在可以跳过多少字节。 字节值可能是 0C，这意味着您应该向下跳 12 个字节。 随后的文本在数据子块中编码（请参阅图像数据以了解这些子块是如何形成的）。 当您到达长度为 0 的子块时，块结束。


- Application Extension - 应用扩展 

该规范允许将特定于应用程序的信息嵌入到 GIF 文件本身中。对应用程序扩展的唯一引用是用于循环动画 GIF 文件的 NETSCAPE2.0 扩展。当我们谈论动画时，我将更详细地介绍循环。

与所有扩展一样，我们从 21 开始，它是扩展介绍器。接下来是应用程序扩展的扩展标签是 FF。下一个值是块大小，它告诉您在实际应用程序数据开始之前有多少字节。该字节值应为 0B，表示 11 个字节。这 11 个字节包含两条信息。首先是应用程序标识符，它占用前 8 个字节。这些字节应包含标识扩展属于哪个应用程序的 ASCII 字符代码。在上面的例子中，应用程序标识符是“NETSCAPE”，它的长度为 8 个字符。接下来的三个字节是应用程序验证代码。规范说这些字节可用于“验证应用程序标识符”。对于 NETSCAPE2.0 扩展，该值只是一个版本号“2.0”，因此是扩展名。接下来是分解为数据子块的应用程序数据。与其他扩展一样，当您读取具有零字节数据的子块时，块将终止。

- Comment Extension - 评论扩展 - 

最后一种扩展类型是评论扩展。 是的，您实际上可以在 GIF 文件中嵌入评论。 为什么要使用不可打印的数据来增加文件大小，我不确定。 也许这是一种传递秘密信息的有趣方式。

第一个字节是 21 的扩展介绍者现在可能并不奇怪。下一个字节总是 FE，它是评论标签。 然后我们直接跳转到包含 ASCII 字符代码的数据子块以供您评论。 从示例中可以看出，我们有一个 9 字节长的数据子块。 如果您翻译字符代码，您会看到注释是“blueberry”。 最后一个字节 00 表示一个子块，后面跟着零字节，让我们知道我们已经到达了块的末尾。

- Trailer - 预告片
拖车块指示您何时到达文件末尾。 它始终是一个值为 3B 的字节。