import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword }) => {
  return (
    <>
      {pages > 1 && (
        <Pagination className="flex justify-content-center gap-1">
          {/* <Pagination.Prev/> */}
          {[...Array(pages).keys()].map((x) => (
            <LinkContainer
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/admin/productsList/page/${x + 1}`
              }
            >
              <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
            </LinkContainer>
          ))}
          {/* <Pagination.Next/> */}
        </Pagination>
      )}
    </>
  );
};

export default Paginate;
