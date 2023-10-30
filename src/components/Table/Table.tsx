import { useState } from "react";
import { useHistory } from "react-router";
import { ReactComponent as DeleteIcon } from "../../assets/SVG/delete.svg";
import { ReactComponent as EditIcon } from "../../assets/SVG/edit.svg";
import { ReactComponent as ViewIcon } from "../../assets/SVG/view.svg";
import { ReactComponent as DownloadIcon } from "../../assets/SVG/downloadIcon.svg";
import CONSTANTS from "../../constants/constants";
import TStandardObject from "../../types/StandardObject";
import { VIDEO_LIBRARY_DETAIL } from "../../utils/routes";
import Button from "../Button/Button";
import Menu from "../Menu/Menu";
import MessagePopup from "../MessagePopup/MessagePopup";
import styles from "./Table.module.scss";
import Entry from "../Entry/Entry";
import EditableText from "../EditableText/EditableText";
import cx from "classnames";

interface TableData {
  [key: string]: string | number | undefined | null;
}

interface MenuData {
  id: string;
  value: string;
  label: string;
}

type TableProps = {
  data: Array<TableData>;
  headerData: Array<string>;
  limit?: number;
  paginationButtonNo?: number;
  showRadioButton?: boolean;
  showActionColumn?: boolean;
  showPagination?: boolean;
  showVideoPreview?: boolean;
  showCloneBtn?: boolean;
  showViewAction?: boolean;
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  hideId?: boolean;
  wrapCol?: boolean;
  columnToWrap?: number[];
  totalRecords?: number;
  onActionClick?: (string: string, index: number | string) => void;
  onMenuClick?: (string: string) => void;
  onRadioButtonChange?: (string: any) => void;
  onPreviewClick?: (string: any) => void;
  onPaginatonClick?: (currentPage: any) => void;
  redirectOnStatusClick?: boolean;
  showStatusMenu?: boolean;
  currentPage?: number;
  statusData?: Array<MenuData>;
  showVideoDownloadIcon?: boolean;
  showCheckboxButton?: boolean;
  onCheckboxChange?: (string: any) => void;
  showVideoTitleInput?: boolean;
  onTitleChange?: (string: any, index: number | string) => void;
  generateSrNo?: boolean;
  inputBoxCol?: number | null;
  onSubtitleChange?: (id: number, txt: any) => void;
  breakWord?: boolean;
};

const Table = ({
  data,
  headerData,
  limit,
  paginationButtonNo = 4,
  onActionClick,
  onMenuClick,
  onPaginatonClick,
  onRadioButtonChange,
  onPreviewClick,
  showCloneBtn = false,
  showRadioButton = false,
  showActionColumn = false,
  showPagination = false,
  showVideoPreview = false,
  showViewAction = true,
  showStatusMenu = true,
  showEditAction = true,
  showDeleteAction = true,
  hideId = false,
  wrapCol = false,
  columnToWrap = [],
  totalRecords = 0,
  redirectOnStatusClick = false,
  currentPage = 1,
  statusData = CONSTANTS.TRANSCODING_STATUS,
  showVideoDownloadIcon = false,
  onCheckboxChange,
  showCheckboxButton = false,
  onTitleChange,
  showVideoTitleInput = false,
  generateSrNo = false,
  inputBoxCol = null,
  onSubtitleChange,
  breakWord = false,
}: TableProps): JSX.Element => {
  const [popupMessage, setPopupMessage] = useState({ show: false, msg: "" });

  const history = useHistory();

  const paginationNumberChange = (currentPage: number) => {
    onPaginatonClick && onPaginatonClick(currentPage);
  };

  const maxPages = (limit && Math.ceil(totalRecords / limit)) || 0;
  const paginationNumbers = () => {
    const paginationNumber = [];
    let leftSide = currentPage - paginationButtonNo;
    if (leftSide <= 0) leftSide = 1;
    let rightSide = currentPage + paginationButtonNo;
    if (rightSide > maxPages) rightSide = maxPages;
    for (let number = leftSide; number <= rightSide; number++) {
      paginationNumber.push(
        <Button
          id={`${number}`}
          styleClass={`${styles.buttonStyle} ${
            number === currentPage ? styles.active : ""
          }`}
          onClick={() => {
            paginationNumberChange(number);
          }}
        >
          {number}
        </Button>
      );
    }
    return paginationNumber;
  };

  const nextPage = () => {
    if (currentPage < maxPages) {
      paginationNumberChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      paginationNumberChange(currentPage - 1);
    }
  };

  const showMenuIcon = (statusType: string, index: number) => {
    if (statusType === "Status" && showStatusMenu)
      return (
        <Menu
          id={`transcodingStatusMenu_${index}`}
          blackIcon={false}
          data={statusData}
          onMenuItemClick={(value) => onMenuClick && onMenuClick(value)}
        />
      );
  };

  const showTableHeaders = () => {
    return headerData.map((data, index) => (
      <>
        <th className={styles.thStyle}>
          {data} {showMenuIcon(data, index)}
        </th>
      </>
    ));
  };

  const redirectToDetailPage = (val: any, id: any) => {
    let pathStep = 4;
    const status = val.split("_")[0];
    const mediaTableStatus = val.split("_")[1];
    if (
      mediaTableStatus === CONSTANTS.STATUS.IN_PROGRESS ||
      mediaTableStatus === CONSTANTS.STATUS.FAILED ||
      mediaTableStatus === CONSTANTS.STATUS.TRANSCODED
    ) {
      setPopupMessage({
        show: true,
        msg:
          mediaTableStatus === CONSTANTS.STATUS.TRANSCODED
            ? "Video has been transcoded"
            : mediaTableStatus === CONSTANTS.STATUS.FAILED
            ? "Video has failed to transcode"
            : "Video transcoding is in progress",
      });
    } else if (status === CONSTANTS.STATUS.EDITING) {
      setPopupMessage({ show: true, msg: "Video is being edited" });
    } else {
      if (status === CONSTANTS.STATUS.UPLOADED) pathStep = 2;
      if (
        status === CONSTANTS.STATUS.EDITED ||
        status === CONSTANTS.STATUS.SAVED_AS_DRAFT
      )
        pathStep = 3;
      history.push({
        pathname: `${VIDEO_LIBRARY_DETAIL}`,
        state: {
          action: CONSTANTS.ACTION.EDIT,
          contentId: id,
          pathStep,
          fromRecentActivity: true,
        },
      });
    }
  };

  const isDataInactive = (value: any) => value === "No" || value === "Inactive";

  const tableData = data.map((row: TStandardObject, index) => {
    const rowData: any = [];
    for (const key in row) {
      rowData.push({
        key: key,
        val: row[key],
      });
    }
    return (
      <tr key={index}>
        {rowData.map((item: any, idx: number) => (
          <td
            key={`${index}-${idx}`}
            className={cx(
              { [styles.wrapCol]: wrapCol && columnToWrap.includes(idx) },
              { [styles.breakWord]: breakWord && idx !== inputBoxCol }
            )}
          >
            {showCheckboxButton && idx === 0 ? (
              <label className={styles.radioWrapper}>
                <input
                  type="checkbox"
                  style={{ marginRight: "2em" }}
                  id={`checkbox_${item.val}`}
                  name="selectedRow"
                  value={`${item.val}`}
                  onChange={() => {
                    onCheckboxChange && onCheckboxChange(index);
                  }}
                />
                {item.val}
              </label>
            ) : showRadioButton && idx === 0 ? (
              <label className={styles.radioWrapper}>
                <input
                  type="radio"
                  style={{ marginRight: "2em" }}
                  id={`id_${item.val}`}
                  name="selectedRow"
                  value={`${item.val}`}
                  onChange={() => {
                    onRadioButtonChange && onRadioButtonChange(index);
                  }}
                />
                {item.val}
              </label>
            ) : hideId && idx === 0 ? (
              <>{item?.val?.split("-")[0]}</>
            ) : redirectOnStatusClick && item.key === "status" ? (
              <input
                type="button"
                className={styles.statusBtn}
                value={item.val.split("_")[0]}
                onClick={() => redirectToDetailPage(item.val, row.contentId)}
              />
            ) : item.key === "rawUrl" && showVideoDownloadIcon ? (
              <a href={row.rawUrl} download>
                <DownloadIcon />
              </a>
            ) : item.key === "videoTitle" && showVideoTitleInput ? (
              <Entry
                id={`id_${item.val}`}
                type="text"
                styleClass={styles.inputStyle}
                placeholder="Video Title"
                value={item.val}
                onChange={(e: any) => onTitleChange && onTitleChange(e, index)}
              />
            ) : generateSrNo && idx === 0 ? (
              index + 1
            ) : inputBoxCol && idx === inputBoxCol ? (
              <EditableText
                id={index}
                data={item.val ?? ""}
                onSubtitleChange={(_id, txt) =>
                  onSubtitleChange && onSubtitleChange(_id, txt)
                }
              />
            ) : (
              item.val
            )}
          </td>
        ))}
        {showActionColumn && (
          <td key={index} className={styles.actionColumnData}>
            {showViewAction && (
              <Button
                styleClass={styles.actionIcon}
                id="viewIcon"
                showTitle
                disabled={isDataInactive(row.isActive)}
                onClick={() =>
                  onActionClick &&
                  onActionClick(CONSTANTS.ACTION.VIEW, row.contentId || "")
                }
              >
                <ViewIcon
                  height={25}
                  fill={isDataInactive(row.isActive) ? "gray" : "red"}
                />
              </Button>
            )}
            {showEditAction && (
              <Button
                styleClass={styles.actionIcon}
                id="editIcon"
                showTitle
                disabled={isDataInactive(row.isActive)}
                onClick={() =>
                  onActionClick &&
                  onActionClick(
                    CONSTANTS.ACTION.EDIT,
                    row.contentId ||
                      row.userId ||
                      row.templateId ||
                      row.propertyId ||
                      row.sku ||
                      ""
                  )
                }
              >
                <EditIcon
                  height={25}
                  fill={isDataInactive(row.isActive) ? "gray" : "#00BE2C"}
                />
              </Button>
            )}
            {showDeleteAction && (
              <Button
                styleClass={styles.actionIcon}
                id="deleteIcon"
                showTitle
                disabled={isDataInactive(row.isActive)}
                onClick={() =>
                  onActionClick &&
                  onActionClick(
                    CONSTANTS.ACTION.DELETE,
                    row.sku ||
                      row.contentId ||
                      row.userId ||
                      row.templateId ||
                      row.propertyId ||
                      row.srNo.split("-")[1] ||
                      ""
                  )
                }
              >
                <DeleteIcon
                  height={25}
                  fill={isDataInactive(row.isActive) ? "gray" : "red"}
                />
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  });

  return (
    <>
      <div className={styles.tableWrapper}>
        <table className={styles.tableStyle}>
          <thead>
            <tr>
              {showTableHeaders()}
              {showActionColumn && (
                <th className={styles.actionColumn}>Action</th>
              )}
            </tr>
          </thead>
          <tbody>{tableData}</tbody>
        </table>

        {tableData.length === 0 && (
          <h4
            style={{ margin: "2em", display: "flex", justifyContent: "center" }}
          >
            No Record Available
          </h4>
        )}
      </div>
      {showPagination && tableData.length !== 0 && (
        <div className={styles.pagination}>
          <div className={styles.buttonWrapper}>
            <div
              className={`${styles.previousNextButton} ${
                currentPage === 1 ? styles.disableButton : styles.enabledButton
              }`}
              onClick={prevPage}
            >
              Previous
            </div>
            {paginationNumbers()}
            <div
              className={`${styles.previousNextButton} ${
                currentPage === maxPages
                  ? styles.disableButton
                  : styles.enabledButton
              }`}
              onClick={nextPage}
            >
              Next
            </div>
          </div>
        </div>
      )}
      {popupMessage.show && (
        <MessagePopup
          message={popupMessage.msg}
          onCloseClick={() => setPopupMessage({ show: false, msg: "" })}
        />
      )}
    </>
  );
};

export default Table;
