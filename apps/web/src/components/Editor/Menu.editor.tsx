import { Button, IconButton, Input } from "@devsozluk/ui";
import { useState } from "react";
import { BiBold, BiImageAdd, BiItalic } from "react-icons/bi";
import { TbLink, TbLinkOff } from "react-icons/tb";
import { CiCircleAlert } from "react-icons/ci";
import { IoMdCode } from "react-icons/io";
import { MdCodeOff } from "react-icons/md";
import { Transition } from "@headlessui/react";
import { CgClose } from "react-icons/cg";
import toast from "react-hot-toast";
import { Editor } from "@tiptap/react";
import Tippy from "@tippyjs/react";
import InsertEmojiButton from "./extensions/Emoji";

const MenuBar = ({ editor }: { editor: Editor }) => {
  const [isOpenLinkModal, setIsOpenLinkModal] = useState(false);

  if (!editor) {
    return null;
  }

  const handleOpenLinkModal = () => {
    setIsOpenLinkModal(true);
  };

  return (
    <>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        <BiBold size={20} />
      </IconButton>
      <IconButton
        className="md:mr-4"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        <BiItalic size={20} />
      </IconButton>
      {!editor.isActive("link") ? (
        <IconButton
          onClick={handleOpenLinkModal}
          disabled={editor.isActive("link")}
        >
          <TbLink size={20} />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => editor.chain().focus()?.unsetLink()?.run()}
          disabled={!editor.isActive("link")}
        >
          <TbLinkOff size={20} />
        </IconButton>
      )}
      <IconButton
        onClick={() =>
          editor.isActive("spoiler")
            ? editor.chain().focus().unsetSpoiler().run()
            : editor.chain().focus().setSpoiler().run()
        }
        isActive={editor.isActive("spoiler")}
      >
        <CiCircleAlert size={20} />
      </IconButton>
      <IconButton
        className="md:mr-4"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
      >
        {!editor.can().chain().focus().exitCode().run() ? (
          <IoMdCode size={20} />
        ) : (
          <MdCodeOff size={20} />
        )}
      </IconButton>
      <Tippy content="Yakında">
        <IconButton disabled={true}>
          <BiImageAdd size={20} />
        </IconButton>
      </Tippy>
      <MenuBar.LinkModal
        editor={editor}
        isOpenLinkModal={isOpenLinkModal}
        setIsOpenLinkModal={setIsOpenLinkModal}
      />
      <InsertEmojiButton editor={editor} />
    </>
  );
};

MenuBar.LinkModal = ({
  editor,
  isOpenLinkModal,
  setIsOpenLinkModal,
}: {
  editor: Editor;
  isOpenLinkModal: boolean;
  setIsOpenLinkModal: (isOpen: boolean) => void;
}) => {
  const [link, setLink] = useState("");

  const handleUpdateLink = () => {
    if (!link) {
      return toast.error("Link yazmalısınız.");
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .run();
    setIsOpenLinkModal(false);
    setLink("");
  };

  const handleCloseModal = () => {
    setIsOpenLinkModal(false);
  };

  const { from, to, empty } = editor.state.selection;
  const selectedText = editor.state.doc.textBetween(from, to, " ");

  return (
    <Transition
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      show={isOpenLinkModal}
      className="absolute z-20 bg-gray-800 rounded-md shadow-xl w-72"
    >
      <div
        tabIndex={0}
        className="flex flex-col items-center p-3 text-sm text-gray-300 truncate transition-colors duration-300 transform rounded-md cursor-pointer hover:text-white"
      >
        <div className="flex items-center justify-between w-full">
          <h3>Link Ekle</h3>
          <IconButton onClick={handleCloseModal}>
            <CgClose size={18} />
          </IconButton>
        </div>
        <div className="flex flex-col w-full">
          <Input
            placeholder="Text"
            value={selectedText}
            className="h-9 !rounded"
          />
          <Input
            placeholder="Link"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            className="h-9 !rounded"
          />
        </div>
        <Button onClick={handleUpdateLink} className="mt-1" size="md">
          Ekle
        </Button>
      </div>
    </Transition>
  );
};

export default MenuBar;
